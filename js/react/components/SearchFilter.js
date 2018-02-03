class SearchFilter extends React.Component {
  constructor(props) {
    super();
    this.state = {
    };
  };
  render() {
    return (
          <div className={"col-12 col-sm-12 col-md-6 col-lg-4 px-2 py-2 typefiltre"}>
            <label className="mb-0">{this.props.division}: {this.props.quantite} <input type="checkbox" value={this.props.division} onClick={this.props.action}/></label>
          </div>
    );
  };
};
