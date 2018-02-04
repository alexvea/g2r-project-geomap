class App extends React.Component {
  constructor() {
    super();
    this.state = {
      googleMapData: "",
      googleMapDataFiltered: [],
      elementsParPage: 12,
      nombrePages: 0,
      pageActuelle: 1,
      savedSelectedstate: {
	                         "selected": []
                          },
    };
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handleTypeFilterClick = this.handleTypeFilterClick.bind(this);
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
    setInterval(
      () => this.checkFilteredData(),
      600
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
    var vignetteList = this.state.googleMapDataFiltered;
    for (let i=0; i<this.state.googleMapData.length; i++) {
      if (markers[i] != null) {
      markers[i].setOptions({'opacity': 0.3})
      };
    };
    for (let i=debut; i<=fin;i++) {
      var vignetteId = vignetteList[i].id;
      if (markers[vignetteId] != null) {
//      console.log(i);
//AV     markers[i].setOptions({icon: 'http://chart.apis.google.com/chart?chst=d_map_xpin_letter&chld=pin|C|007bff'});
        markers[vignetteId].setOptions({'opacity': 1})
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
      fin = this.state.googleMapDataFiltered.length-1;
//    console.log("F  "+fin);
      break;
      case this.state.nombrePages >= 1:
        if(this.state.pageActuelle == 1) {
          debut = 0;
          fin = (this.state.pageActuelle*this.state.elementsParPage) -1;
        } else {
          debut = ((this.state.pageActuelle-1)*this.state.elementsParPage);  // pour pageactuelle=2 debut=12
          if (this.state.googleMapDataFiltered.length-debut > 11) {
            fin = debut+11
          } else {
            fin = debut+(this.state.googleMapDataFiltered.length%this.state.elementsParPage)-1;
          };
        };
      break;
      default:
    };
  //    console.log("R "+debut+","+fin);
      this.setCurrentDisplayedMarkers(debut,fin);
    //  return debut+","+fin;
  };
  // Ajout un listener pour chaque vignette.
  addListenerVignettes() {
    for (let i=0; i<this.state.googleMapData.length;i++ ) {
      $("#vignette"+i).off("click");
      $("#vignette"+i).on("click", function() {
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
            googleMapDataFiltered: searchedData,
          });
          this.resetSelectedVignette();
      };
    };
  };



  resetSelectedVignette() {
    var nbVignette = this.state.googleMapDataFiltered.length;
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
    var nombrePages = Math.ceil(this.state.googleMapDataFiltered.length/this.state.elementsParPage);
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

checkFilteredData() {
  if (document.querySelector(".typefiltre input:checked") == null) {
    var CompareData = this.state.googleMapData;
    var allTypes = document.querySelectorAll('.typefiltre input:not([value="SELECTION"])');
    for (var i = 0; i < allTypes.length; i++) {
      allTypes[i].disabled = false;
      allTypes[i].hidden = false;
    }
    this.setState({googleMapDataFiltered: this.state.googleMapData});
  }

}
handleTypeFilterClick(event) {
  if (document.querySelector(".typefiltre input:checked") == null) {
    var allTypes = document.querySelectorAll('.typefiltre input:not([value="SELECTION"])');
    for (var i = 0; i < allTypes.length; i++) {
      allTypes[i].disabled = false;
      allTypes[i].hidden = false;
    }
    this.setState({googleMapDataFiltered: this.state.googleMapData});
  } else {
    var toFilteredData = [];
    var CompareData = this.state.googleMapData;
    var allTypes = document.querySelectorAll('.typefiltre input:not([value="SELECTION"])');
    var typeSelection = document.querySelectorAll('.typefiltre input[value="SELECTION"]');
    var SearchedDataSnap = Defiant.getSnapshot(CompareData);
    if ((typeSelection.length != 0)) {
      if (typeSelection[0].checked == true) {
        for (var i = 0; i < allTypes.length; i++) {
          allTypes[i].disabled = true;
          allTypes[i].hidden = true;
          allTypes[i].checked = false;
        }
        typeSelection[0].disabled = false;
        typeSelection[0].hidden = false;
        let objectSelectedVignettes = this.state.savedSelectedstate;
        for (var i = 0; i < objectSelectedVignettes['selected'].length; i++) {
          if (objectSelectedVignettes['selected'][i] == true) {
            let vignetteId = i;
            var FilteredDataOneType = JSON.search(SearchedDataSnap, "//*[id=" + vignetteId + "]");
            toFilteredData = Object.freeze(toFilteredData.concat(FilteredDataOneType));
          }
        }
      }
    }

    for (var i = 0; i < allTypes.length; i++) {
      if (allTypes[i].checked == true) {
        var Type = allTypes[i].value;
        var FilteredDataOneType = JSON.search(SearchedDataSnap, "//*[division='" + Type + "']");
        toFilteredData = Object.freeze(toFilteredData.concat(FilteredDataOneType));
      };
    };

    this.setState({googleMapDataFiltered: toFilteredData});
    this.getCurrentDisplayedVignettes();
  };
};

  renderVignettes() {
    var rowsVignette = [];
    var CurrentSelectedVignettes = "";
    const indexOfLastTodo = this.state.pageActuelle * this.state.elementsParPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.elementsParPage;
    const vignettesToDisplay = this.state.googleMapDataFiltered;
    for(var k in vignettesToDisplay) {
        if (indexOfFirstTodo <= k && k < indexOfLastTodo) {
            rowsVignette.push(<Vignette key={k} name={vignettesToDisplay[k].nom} adresse={vignettesToDisplay[k].adresse} intitule={vignettesToDisplay[k].intitule} division={vignettesToDisplay[k].division} cle={vignettesToDisplay[k].id} url={vignettesToDisplay[k].url}  score={vignettesToDisplay[k].score} saveCurrentState={this.saveCurrentState.bind(this)} savedSelectedstate={this.state.savedSelectedstate.selected[vignettesToDisplay[k].id]}/>);
        };
    };
    return rowsVignette;
  };


renderSearchFilter() {
  if (this.state.googleMapData == this.state.googleMapDataFiltered) {
    var allTypes = document.querySelectorAll(".typefiltre input");
    for (var i = 0; i < allTypes.length; i++) {
      allTypes[i].checked = false;
    };
  }

  var rowsTypeFilter = [];
  const data = this.state.googleMapData;
  var newData = []
  for (var k in data) {
    newData.push(data[k].division);
  };
  var dataDivision = compressArray(newData);
  for (var k in dataDivision) {
    rowsTypeFilter.push(<SearchFilter division={dataDivision[k].value} quantite={dataDivision[k].count} action={this.handleTypeFilterClick}/>);
  };
  let objectSelectedVignettes = this.state.savedSelectedstate;
  var nbSelectedVignette = 0;
  for (var i = 0; i < objectSelectedVignettes['selected'].length; i++) {
    if(objectSelectedVignettes['selected'][i] == true){
      nbSelectedVignette++;
    }
  }
  if (nbSelectedVignette != 0) {
    rowsTypeFilter.push(<SearchFilter division="SELECTION" quantite={nbSelectedVignette} action={this.handleTypeFilterClick}/>);
  }
  return rowsTypeFilter;
};

  render() {
    if(this.state.googleMapData.length > 0) {
      this.setPagesNumber();
      return (
        <div>
          <div className="row">
            {this.renderSearchFilter()}
          </div>
          <div className="row">
            {this.renderVignettes()}
          </div>
          <div className="row">
          <Pagination elementsParPage={this.state.elementsParPage} nombrePages={this.state.nombrePages} pageActuelle={this.state.pageActuelle} action={this.handlePaginationClick}/>
          </div>
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
