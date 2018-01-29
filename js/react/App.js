class App extends React.Component {
  constructor() {
    super();
    this.state = {
      googleMapData: "",
      elementsParPage: 12,
      nombrePages: 0,
      pageActuelle: 1,
      savedSelectedstate: {
	                         "selected": []
                          },
    };
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
  };
  componentWillMount() {
    this.getGoogleMapData();
  };
  componentDidMount() {
    setInterval(
      () => this.getGoogleMapData(),
      800
    );
    setInterval(
      () => this.addListenerVignettes(),
      800
    );
    setInterval(
      () => this.getCurrentDisplayedVignettes(),
      500
    );
    this.resetSelectedVignette();

  };
/*TODO     setInterval(
      () => console.log("TTOOO  " + this.getCurrentDisplayedVignettes()),
      1000
    ); */


/*    google.maps.event.addDomListener(document.getElementById("vignette1"), 'mouseover', function() {
console.log("TTOOO  " + this.getCurrentDisplayedVignettes());
    }); */



  setCurrentDisplayedMarkers(debut,fin) {
    for (let i=0; i<this.state.googleMapData.length; i++) {
      if (markers[i] != null) {
        markers[i].setOptions({icon: ""});
      };
    };
    for (let i=debut; i<=fin;i++) {
      if (markers[i] != null) {
//      console.log(i);
      markers[i].setOptions({icon: 'http://chart.apis.google.com/chart?chst=d_map_xpin_letter&chld=pin|C|007bff'});
      };
    };
  };
  getCurrentDisplayedVignettes() {
    var debut ="";
    var fin ="";
//    console.log("P "+this.state.nombrePages);
    switch (true) {
      case this.state.nombrePages == 1:
      debut = 0;
      fin = this.state.googleMapData.length-1;
      break;
      case this.state.nombrePages >= 1:
        if(this.state.pageActuelle == 1) {
          debut = 0;
          fin = (this.state.pageActuelle*this.state.elementsParPage) -1;
        } else {
          debut = ((this.state.pageActuelle-1)*this.state.elementsParPage);  // pour pageactuelle=2 debut=12
          if (this.state.googleMapData.length-debut > 11) {
            fin = debut+11
          } else {
            fin = debut+(this.state.googleMapData.length%this.state.elementsParPage)-1;
          };
        };
      break;
      default:
    };
      console.log("R "+debut+","+fin);
      this.setCurrentDisplayedMarkers(debut,fin);
    //  return debut+","+fin;
  };
  // Ajout un listener pour chaque vignette.
  addListenerVignettes() {
    for (let i=0; i<this.state.googleMapData.length;i++ ) {
      $("#vignette"+i).off("click");
      $("#vignette"+i).on("click", function() {
        console.log("vignette"+i);
        if (this.classList.contains("selectioncss")){
          markers[i].setOptions({animation: false});
        } else {
          markers[i].setOptions({animation: google.maps.Animation.BOUNCE});
        };
    //  google.maps.event.trigger(markers[i], 'click');
      });
    };
  };

  getGoogleMapData() {
  //   var searchedData = JSON.parse($("#searchdata").val());
    if (sessionStorage.getItem("searchdataLS") == null) {
      setTimeout(() => {
   this.getGoogleMapData()
 }, 500);
    } else {
        var searchedData = JSON.parse(sessionStorage.getItem("searchdataLS"));
        //  console.log(sessionStorage.getItem('searchdata'));
        if (JSON.stringify(searchedData) != JSON.stringify(this.state.googleMapData) || this.state.googleMapData == "") {
          this.setState({
            googleMapData: searchedData,
          });
          this.resetSelectedVignette();
      };
    };
  };



  resetSelectedVignette() {
    var nbVignette = this.state.googleMapData.length;
    var ObjectAllFalseSelectedVignettes = {};
    ObjectAllFalseSelectedVignettes.selected = [];
    for (var i=0; i<nbVignette;i++) {
          var item = false;
          ObjectAllFalseSelectedVignettes.selected.push(item);
    };
/*        console.log(ObjectSelectedVignette);
    sessionStorage.setItem('SelectedVignettes', JSON.stringify(ObjectSelectedVignette)); */
    this.setState({
      savedSelectedstate: ObjectAllFalseSelectedVignettes,
    });
    sessionStorage.setItem("selectedVignettesLS",  JSON.stringify(ObjectAllFalseSelectedVignettes));
  };

  setPagesNumber() {
    var nombrePages = Math.ceil(this.state.googleMapData.length/this.state.elementsParPage);
    if (nombrePages != this.state.nombrePages) {
      this.setState({
      nombrePages: nombrePages,
      });
    };
    this.setCurrentPage();
  };

  setCurrentPage() {
    var nbpage = this.state.nombrePages;
    var pageActu = this.state.pageActuelle;
    if (pageActu > nbpage) {
      this.setState ({
          pageActuelle: 1,
      });
    };
  };

  saveCurrentState(nb,etat) {
    let objectSelectedVignettes = this.state.savedSelectedstate;
    objectSelectedVignettes.selected.splice(nb, 1, etat);
    this.setState ({
      savedSelectedstate: objectSelectedVignettes,
    });
    sessionStorage.setItem("selectedVignettesLS",  JSON.stringify(objectSelectedVignettes));
  };

  handlePaginationClick(event) {
    var numero = 0;
    var numBouton = Number(event.target.id);
    var pageActuelle = this.state.pageActuelle;
    /*TODO déplacement de la page quand clic sur pagination
   //  console.log(window.innerHeight + " " + document.querySelector(".PaginateNav").offsetTop );
    if ((document.querySelector(".PaginateNav").offsetTop - window.innerHeight) < 400) {
      console.log((document.querySelector(".PaginateNav").offsetTop - window.innerHeight));
    }*/
    if (numBouton == "-1") {
      if ((pageActuelle - 1) != 0) {
        numero = pageActuelle - 1;
      } else {
        numero = pageActuelle;
      };
    } else if (numBouton == "-2") {
      if ((pageActuelle + 1) <= this.state.nombrePages) {
        numero = pageActuelle + 1;
      } else {
        numero = pageActuelle;
      };
    } else {
      numero = numBouton;
    };
    this.setState({
      pageActuelle: numero
    });
  };

  renderVignettes() {
    var rowsVignette = [];
    var CurrentSelectedVignettes = "";
    const indexOfLastTodo = this.state.pageActuelle * this.state.elementsParPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.elementsParPage;
    const vignettesToDisplay = this.state.googleMapData;
    for(var k in vignettesToDisplay) {
        if (indexOfFirstTodo <= k && k < indexOfLastTodo) {
            rowsVignette.push(<Vignette key={k} name={vignettesToDisplay[k].nom} adresse={vignettesToDisplay[k].adresse} cle={k} saveCurrentState={this.saveCurrentState.bind(this)} savedSelectedstate={this.state.savedSelectedstate.selected[k]}/>);
            rowsVignette.push(<Vignette key={k} name={vignettesToDisplay[k].nom} adresse={vignettesToDisplay[k].adresse} intitule={vignettesToDisplay[k].intitule} division={vignettesToDisplay[k].division} cle={k} saveCurrentState={this.saveCurrentState.bind(this)} savedSelectedstate={this.state.savedSelectedstate.selected[k]}/>);
        };
    };
    return rowsVignette;
  };

  render() {
    if(this.state.googleMapData.length > 0) {
      this.setPagesNumber();
      return (
        <div>
          <SearchFilter />
          <div className="row">
            {this.renderVignettes()}
          </div>
          <Pagination elementsParPage={this.state.elementsParPage} nombrePages={this.state.nombrePages} pageActuelle={this.state.pageActuelle} action={this.handlePaginationClick}/>
        </div>
      );
    } else {
      return(
        <div> PAS DE RESULTAT </div>
      )
    };
    };
  };















  var originalSetItem = sessionStorage.setItem;
  sessionStorage.setItem = function() {
    var event = new Event('sessionStorageModified');
    document.dispatchEvent(event);
    originalSetItem.apply(this, arguments);
  }

  var storageHandler = function(e) {
    ReactDOM.render(
      <App />,
      document.getElementById('root')
    );
  };

  document.addEventListener("sessionStorageModified", storageHandler, false);







 /* $("#searchdata").on('DOMSubtreeModified', function () {
   ReactDOM.render(
     <App />,
     document.getElementById('root')
   );
}); */
