class Pagination extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  };
  makeRenderPageNumbers() {
    const pageNumbers = [];
    for (let i=1; i<(this.props.nombrePages+1); i++){
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      if (this.props.pageActuelle == number) {
         var classActive = " active";
      } else {
         var classActive = "";
      }
      return (
        <li className={"page-item" + classActive}><a className="page page-link" key={number} id={number} onClick={this.props.action}>{number}</a></li>
      );
    });
    return renderPageNumbers;
  }
  render() {
    if (this.props.nombrePages > 1) {
      return (
      <nav className="PaginateNav mx-auto" aria-label="Page navigation example">
          <ul id="page-numbers" className="pagination justify-content-center">
          <li className="page-item" ><a className="prev page-link" id="-1" onClick={this.props.action}><i class="fa fa-arrow-left"></i></a></li>
                  {this.makeRenderPageNumbers()}
          <li className="page-item"><a className="next page-link" id="-2" onClick={this.props.action}><i class="fa fa-arrow-right"></i></a></li>
          </ul>
      </nav>
    );
  } else {
    return (
      <div></div>
    );
  };
  };
};
