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
      () => this.setState({ selected: this.props.savedSelectedstate }),
      1000
    );
  }
  handleVignetteClick(event) {
    this.props.saveCurrentState(this.props.cle,!this.state.selected);
//    const CurrentSelectedVignettes = JSON.parse(localStorage.getItem('SelectedVignettes'));
    const currentState = this.state.selected;
      if (currentState != true) {
         this.setState({ selected: true });
  //        CurrentSelectedVignettes.selected[this.props.cle] = true;
      } else {
          this.setState({selected: false });
//          CurrentSelectedVignettes.selected[this.props.cle] = false;
      }
  //    localStorage.setItem('SelectedVignettes', JSON.stringify(CurrentSelectedVignettes));
  }
  render() {
    return (
      <div className={"col-12 col-sm-12 col-md-6 col-lg-4 px-1 py-1 card-pagination"} onClick={this.handleVignetteClick}>
              <div id={"vignette"+this.props.cle} className={"card shadow h-100 w-100"  + (this.state.selected ?  " selectioncss": "")}>
                <div className="card-header">
                  {this.props.name}
                </div>
                <div className="card-body">
                  <blockquote className="blockquote mb-0">
                    <p>{this.props.adresse}</p>
                    <p>Numéro tel : </p>
                    <footer>Site internet : </footer>
                  </blockquote>
                </div>
              </div>
             </div>
    );
  };
};
