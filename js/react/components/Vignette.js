class Vignette extends React.Component {
  constructor(props) {
    super();
    this.state = {
      selected: props.savedSelectedstate,
    };
    this.handleVignetteClick = this.handleVignetteClick.bind(this);
  };
  componentDidMount() {
    setInterval(
      () => {
        this.setState({ selected: this.props.savedSelectedstate });
        this.addWebsite();
      },
      1000
    );
  }
  handleVignetteClick(event) {
    this.props.saveCurrentState(this.props.cle,!this.state.selected);
//    const CurrentSelectedVignettes = JSON.parse(sessionStorage.getItem('SelectedVignettes'));
    const currentState = this.state.selected;
      if (currentState != true) {
         this.setState({ selected: true });
  //        CurrentSelectedVignettes.selected[this.props.cle] = true;
      } else {
          this.setState({selected: false });
//          CurrentSelectedVignettes.selected[this.props.cle] = false;
      }
  //    sessionStorage.setItem('SelectedVignettes', JSON.stringify(CurrentSelectedVignettes));
  }
  addWebsite(){

  }
  render() {
    return (
      <div className={"col-12 col-sm-12 col-md-6 col-lg-4 px-1 py-1 card-pagination"} onClick={this.handleVignetteClick}>
              <div id={"vignette"+this.props.cle} className={"card shadow h-100 w-100"  + (this.state.selected ?  " selectioncss "+this.props.division: "")}>
                <div className="card-header p-1">
                  {this.props.name}
                </div>
                <div className="card-body p-2">
                  <blockquote className="mb-0">
                    <p>{this.props.adresse}</p>
                    <p><u>Activité :</u> {this.props.intitule}</p>
                    <div className="spacervignette"></div>
                    <span id={"toto"+this.props.cle} className="website"><u>Site internet :</u></span>
                    <div className={"position-div-loader " + (this.props.url ? "": " loader "+this.props.division)}>
                    </div>
                    <a className={"position-div-loader " + (this.props.url == "NA" ? "disabled": "")} href={(this.props.url == "NA" ? "": this.props.url)} target='_blank'>
                    <i className={"fa fa-2x " + (this.props.url == "NA" ? "fa-times": ((this.props.url != "" && this.props.url !="NA") ? "fa-link": ""))}></i>
                    </a>
                  </blockquote>
                </div>
              </div>
             </div>
    );
  };
};
