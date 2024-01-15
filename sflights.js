function flight(param) {
  //this.header = {};
  this.flightlist = {};
  this.origins = {};
  this.destinations = {};
  
  this.ignorefields = {'datetext':1,'headers':1,'headersarray':1};
  this.headertext = " To:";
  this.airportnames = cities.airportnames
  this.airportcodes = cities.airportcodes
  //Div container to output flights
  this.contentdiv = document.getElementById('dataDiv');

  this.datetext = "Dates Valid";
  this.defaultheader = ["Fares From"];
  this.headerappend = '';
  this.headermap = false;
  this.prependdaysofweek = '';
  this.prependdaysofweek = '';
  this.dateappendtext = '';
  this.formatdecimal = true;
  this.formatfare = true;
  //List of default keywords to check for and map to link
  this.specialfares = {'no match':1,'':1,'No Match':1,'NO MATCH': 1,'':1,undefined:1};
  this.dayarray = ['Sat','Sun','Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon','Tue','Wed','Thu','Fri'];
  this.specialdayappend = ' only';
  this.setspecialappend = true;
  this.reversesort = false;
  this.specialfaretext = ['search for ultra-low fares','search for ultra-low fares','search for ultra-low fares','search for ultra-low fares','search for ultra-low fares'];
  //Link to map special fares to
  this.specialfarelink = ['http://www.spirit.com/Default.aspx?BookingType=F&From=%%origin_code%%&To=%%destination_code%%','http://www.spirit.com/Default.aspx?BookingType=F&From=%%origin_code%%&To=%%destination_code%%','http://www.spirit.com/Default.aspx?BookingType=F&From=%%origin_code%%&To=%%destination_code%%','http://www.spirit.com/Default.aspx?BookingType=F&From=%%origin_code%%&To=%%destination_code%%','http://www.spirit.com/Default.aspx?BookingType=F&From=%%origin_code%%&To=%%destination_code%%'];
  this.ignoreorigin = false;
  this.farelinks = ['','','','',''];
  this.fareappend = ['* one-way','* one-way','* one-way','* one-way','* one-way','* one-way'];
  this.hidedatevalid = false;

  //private constructor
  this.htmldecode = function (str) {
    return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  }
  this.mapheader = function (dweek) {
    var dayflags = parseInt(dweek,10);
    var cnt = 0;
    var rmd;
    var dtstr  = '';
    //Monday
    if (2 & dayflags) {
      dtstr += this.dayarray[2] + ', ';
      cnt++;
    }
    //Tuesday
    if (4 & dayflags) {
      dtstr += this.dayarray[3] + ', ';
      cnt++;
    }
    //Wednesday
    if (8 & dayflags) {
      dtstr += this.dayarray[4] + ', ';
      cnt++;
    }
    //Thursday
    if (16 & dayflags) {
      dtstr += this.dayarray[5] + ', ';
      cnt++;
    }
    //Friday
    if (32 & dayflags) {
      dtstr += this.dayarray[6] + ', ';
      cnt++;
    }
    //Saturday
    if (64 & dayflags) {
      dtstr += this.dayarray[7] + ', ';
      cnt++;
    }
    //Sunday
    if (1 & dayflags) {
      dtstr += this.dayarray[1] + ', ';
      cnt++;
    }
    if (dtstr) {
      dtstr = dtstr.substring(0,dtstr.length - 2);
      dtstr = dtstr.replace(/,\s([^,]+)$/, ' & $1')
    }
    if (this.setspecialappend  && (cnt == 1) ){
        dtstr += this.specialdayappend;
    }
    return dtstr;
  }
  this.setsettings = function (param) {
    if (param) {
      if (param.contentdiv != undefined) {
        this.setdiv(param.contentdiv);
      }
      if (param.specialfaretext != undefined) {
        this.specialfaretext = param.specialfaretext;
      }
      if (param.specialfarelink != undefined) {
        this.specialfarelink = param.specialfarelink;
      }
      if (param.datetext != undefined) {
        this.datetext = param.datetext;
      }
      if (param.defaultheader != undefined) {
        this.defaultheader = param.defaultheader;
      }
      if (param.headertext != undefined) {
        this.headertext = param.headertext;
      }
      if (param.farelinks != undefined) {
        this.farelinks = param.farelinks;
      }
      if (param.headerappend != undefined) {
        this.headerappend = param.headerappend;
      }
      if (param.headermap != undefined) {
        this.headermap = param.headermap;
      }
      if (param.prependdaysofweek != undefined) {
        this.prependdaysofweek = param.prependdaysofweek;
      }
      if (param.dayarray != undefined) {
        this.dayarray = param.dayarray;
      }
      if (param.fareappend != undefined) {
        this.fareappend = param.fareappend;
      }
      if (param.formatdecimal != undefined) {
        this.formatdecimal = param.formatdecimal;
      }
      if (param.dateappendtext != undefined) {
        this.dateappendtext = param.dateappendtext;
      }
      if (param.formatfare != undefined) {
        this.formatfare = param.formatfare;
      }
      if (param.specialdayappend != undefined) {
        this.specialdayappend = param.specialdayappend;
      }
      if (param.setspecialappend != undefined) {
        this.setspecialappend = param.setspecialappend;
      }
      if (param.reversesort != undefined) {
        this.reversesort = param.reversesort;
      }
      if (param.ignoreorigin != undefined) {
        this.ignoreorigin = param.ignoreorigin;
      }
      if (param.specialfares != undefined) {
        this.specialfares = param.specialfares;
      }
      if (param.hidedatevalid != undefined) {
        this.hidedatevalid = param.hidedatevalid;
      }
    }
  }

  //set output div container by id
  this.setdiv = function (divid) {
    this.contentdiv = document.getElementById(divid);
  }
  this.reformatfare = function(fare) {
    var mfare = fare;
    
    if (mfare.match(/^(\s|\d|\.)+$/)) {
      var pf = parseFloat(mfare);
      if (this.formatdecimal) {
        mfare = '$' + pf.toFixed(2);
      }
      else {
        mfare = '$' + parseInt(pf,10);
      }
    }
    return mfare;
  }
  this.debug = function() {
    var db = {};
    db['flightlist'] = this.flightlist;
    db['origins'] = this.origins;
    return db;
  }
  this.loadflight = function (flights) {
    var flightlist = this.flightlist;
    var od = flights['o_d'];
    var ocode = od.substr(0,3);
    var dcode = od.substr(3,3);
    if (this.ignoreorigin) {
      ocode = '';
    }
    if (this.airportnames[ocode] && this.airportnames[dcode]) {
  
      //if flight origin doesnt exist intialize it hash
      if (flightlist[ocode] == undefined) {
        flightlist[ocode] = {};
      }
  
      //if flight destination doesnt exist intialize it hash
      if (flightlist[ocode][dcode] == undefined) {
        flightlist[ocode][dcode] = {};
      }
  
      //initialize header rows
      if (flightlist[ocode]['headers'] == undefined) {
        flightlist[ocode]['headers'] = {};
        flightlist[ocode]['headersarray'] = [];
      }
      var mhd;
      //header passed assigned header
      if ( flights['header'] != undefined) {
        if (this.headermap) {
          mhd = this.mapheader(flights['header'])  + this.headerappend;
        }
        else {
            mhd = flights['header']  + this.headerappend;
        }
        if (flightlist[ocode]['headers'][mhd] == undefined) {
          flightlist[ocode]['headers'][mhd] = flightlist[ocode]['headersarray'].length;
          flightlist[ocode]['headersarray'].push(mhd);
        }
        if (flightlist[ocode][dcode][mhd] == undefined) {
            flightlist[ocode][dcode][mhd] = {};
        }
        //push all the information into the flight array index on origin and header
        flightlist[ocode][dcode][mhd] = {
          'origin_code' : ocode,
          'destination_code' : dcode
        };

        var i = flights['fare'].length -1;
        var flink,hlink,nfare,nfind,nfindex;
        nfare = '';
        nfindex = 0;
        for (i;i >= 0;i--) {
          if (flights['fare'][i] && (flights['fare'][i] != undefined) && !nfare ) {
            nfare = flights['fare'][i];
            if (this.formatfare) {
              nfare = this.reformatfare(nfare);
            }
            nfindex = i;
          }
        }
        if (!nfare || (this.specialfares[nfare.toLowerCase()] != undefined) ) {
          flink = '';
          if (this.specialfaretext[nfindex] && (this.specialfaretext[nfindex] != undefined)) {
            flink = this.specialfaretext[nfindex];
          }
          hlink = '';
          if (this.specialfarelink[nfindex] && (this.specialfarelink[nfindex] != undefined)) {
            hlink = this.specialfarelink[nfindex];
            for (var pf in flightlist[ocode][dcode][mhd]) {
              if (flightlist[ocode][dcode][mhd].hasOwnProperty(pf)) {
                hlink = hlink.replace('%%' + pf + '%%',flightlist[ocode][dcode][mhd][pf]);
              }
            }
            hlink = hlink.replace('%%fare%%',nfare);
          }
          flightlist[ocode][dcode][mhd]['fare'] = '\xa0<a href="' + hlink + '">' + flink + '</a>';
        }
        else {
          if (this.farelinks[nfindex] && (this.farelinks[nfindex] != undefined)) {
            flink = this.htmldecode(nfare);
            if (this.fareappend[nfindex] != undefined) {
              flink += this.fareappend[nfindex];
            }
            hlink = this.farelinks[nfindex];
            for (var pf in flightlist[ocode][dcode][mhd]) {
              if (flightlist[ocode][dcode][mhd].hasOwnProperty(pf)) {
                hlink = hlink.replace('%%' + pf + '%%',flightlist[ocode][dcode][mhd][pf]);
              }
            }
            hlink = hlink.replace('%%fare%%',nfare);
            flightlist[ocode][dcode][mhd]['fare'] = '\xa0<a href="' + hlink + '">' + flink + '</a>';
          }
          else {
            ftext = this.htmldecode(nfare);
            if (this.fareappend[nfindex] != undefined) {
              ftext += this.fareappend[nfindex];
            }
            flightlist[ocode][dcode][mhd]['fare'] = '&nbsp;' + ftext;
          }
        }
      }
      //no header, use default to map header
      else {
        var hdr = this.defaultheader;
        for (var i = 0; i < hdr.length;i++) {
  
          mhd = hdr[i];
          if (mhd == undefined) {
            mhd = '';
          }
          //if header doesnt exist, initalize it as an array
          if (flightlist[ocode][dcode][mhd] == undefined) {
            flightlist[ocode][dcode][mhd] = {};
          }
          //push all the information into the flight array index on origin and header
          flightlist[ocode][dcode][mhd] = {
            'origin_code' : ocode,
            'destination_code' : dcode
          };
          
          if ((flights['fare'][i] == undefined)|| (!flights['fare'][i]) || (this.specialfares[flights['fare'][i].toLowerCase()] != undefined) ) {
            flink = '';
            if (this.specialfaretext[i] && (this.specialfaretext[i] != undefined)) {
              flink = this.specialfaretext[i];
            }
            hlink = '';
            if (this.specialfarelink[i] && (this.specialfarelink[i] != undefined)) {
              hlink = this.specialfarelink[i];
              for (var pf in flightlist[ocode][dcode][mhd]) {
                if (flightlist[ocode][dcode][mhd].hasOwnProperty(pf)) {
                  hlink = hlink.replace('%%' + pf + '%%',flightlist[ocode][dcode][mhd][pf]);
                }
              }
              hlink = hlink.replace('%%fare%%',flights['fare'][i]);
            }
            flightlist[ocode][dcode][mhd]['fare'] = '\xa0<a href="' + hlink + '">' + flink + '</a>';
          }
          else {
            if (this.farelinks[i] && (this.farelinks[i] != undefined)) {
              flink = this.htmldecode(flights['fare'][i]);
              if (this.formatfare) {
                flink = this.reformatfare(flink);
              }
              if (this.fareappend[i] != undefined) {
                flink += this.fareappend[i];
              }
              hlink = this.farelinks[i];
              for (var pf in flightlist[ocode][dcode][mhd]) {
                if (flightlist[ocode][dcode][mhd].hasOwnProperty(pf)) {
                  hlink = hlink.replace('%%' + pf + '%%',flightlist[ocode][dcode][mhd][pf]);
                }
              }
              hlink = hlink.replace('%%fare%%',flights['fare'][i]);
              flightlist[ocode][dcode][mhd]['fare'] = '\xa0<a href="' + hlink + '">' + flink + '</a>';
            }
            else {
              ftext = this.htmldecode(flights['fare'][i]);
              if (this.formatfare) { 
                ftext = this.reformatfare(ftext);
              }
              if (this.fareappend[i] != undefined) {
                ftext += this.fareappend[i];
              }
              flightlist[ocode][dcode][mhd]['fare'] = '&nbsp;' + ftext;
            }
          }
          if (flightlist[ocode]['headers'][mhd] == undefined) {
            flightlist[ocode]['headers'][mhd] = flightlist[ocode]['headersarray'].length;
            flightlist[ocode]['headersarray'].push(mhd);
          }     
        }
      }
      if (this.prependdaysofweek && (flights[this.prependdaysofweek] != undefined)) {
        if (this.headermap) {
          flightlist[ocode][dcode]['prepend'] = this.mapheader(flights[this.prependdaysofweek]) + '<br />';
        }
        else {
          flightlist[ocode][dcode]['prepend'] = flights[this.prependdaysofweek] + '<br />';
        }
      }
      
      flightlist[ocode][dcode]['dates'] = flights['dates'];
      //flightlist[flights['origin_name']][flights['destination_name']].push(flights);
      if (flights['datetext']) {
        flightlist[ocode].datetext = flights['datetext'];
      }
      else {
        flightlist[ocode].datetext = this.datetext;
      }
      this.origins[ocode] = 1;
      this.destinations[dcode] = 1;
    }
  }


  this.render = function(selectedorigin) {
    if (selectedorigin == undefined) {
      selectedorigin = 'All';
    }
    
    var originsarr = [];
    for (var org in this.origins) {
      if (this.origins.hasOwnProperty(org)) {
        if ((selectedorigin == 'All') || (org == selectedorigin)) {
          if (this.airportnames[org] != undefined) {
            originsarr.push(this.airportnames[org]);
          }
          else {
            originsarr.push(org);
          }
        }
      }
    }

    this.contentdiv.innerHTML  = ''; //Flights<br />';

    originsarr.sort();
    var newTable,header_tr,header_td,content_tr,content_td,fh,iflight;
    var destination,fare,flink,ftext,hlink,farr,headers,destcity,dates,wd,content_tb,th,mh;
    
    for (var o = 0; o < originsarr.length; o++) {

      newTable = document.createElement('table');
      newTable.setAttribute('id',"flighttable");
      newTable.setAttribute('width',"100%");
      newTable.setAttribute('cellpadding',"0");
      newTable.setAttribute('cellspacing',"0");
      newTable.setAttribute('border',"0");


      iflight = this.flightlist[this.airportcodes[originsarr[o]]];
      headers = iflight['headers'];
      //generate header row
      header_tr = document.createElement('tr');
      header_tr.className = "tableHead";

      //keep an index of all possible fare types
      farr = [];
      for (var i in iflight['headers']) {
        if (iflight['headers'].hasOwnProperty(i) ){
            farr.push(i);
        }
      }
      if (this.reversesort) {
        farr.reverse();
      }
      wd = parseInt(100/(farr.length + 2),10) + '%';
    
      header_td = document.createElement('td');
      header_td.width = wd;
      if (this.ignoreorigin) {
        header_td.innerHTML = this.headertext;
      }
      else {
        header_td.innerHTML = originsarr[o] + this.headertext;
      }
      header_tr.appendChild(header_td);

      //loop through fare types to output header
      for (var f = 0; f < farr.length; f++) {
        if (farr[f] != '') {
          header_td = document.createElement('td');
          header_td.innerHTML = farr[f];
          header_td.width = wd;
          header_tr.appendChild(header_td);
        }
      }
      if (!this.hidedatevalid ) {
        header_td = document.createElement('td');
  
        header_td.innerHTML = iflight.datetext;
  
        header_td.width = wd;
        header_tr.appendChild(header_td);
      }
      th = document.createElement('thead');
      th.appendChild(header_tr);
      newTable.appendChild(th);
      content_tb = document.createElement('tbody');
      var altrow = true;
      //loop through all destination city
      var destinationarr = [];
      for (var dest in iflight) {
        if (iflight.hasOwnProperty(dest)) {
          if (this.ignorefields[dest] == undefined) {
            if (this.airportnames[dest] != undefined) {
              destinationarr.push(this.airportnames[dest]);
            }
            else {
              destinationarr.push(dest);
            }
          }
        }
      }
      destinationarr.sort();
      for (var j = 0; j < destinationarr.length;j++) {
        //loop though all departures and index
        //if ((mh != 'headers') && (mh != 'datetext')) {
        
        mh = this.airportcodes[destinationarr[j]];
        
        content_tr = document.createElement('tr');
        if (altrow) {
        content_tr.className = "row_type1";
        }
        else {
        content_tr.className = "row_type2";
        }
        altrow = !altrow;
        content_td = document.createElement('td');
        content_td.innerHTML = '&nbsp;' + this.airportnames[mh];
        content_tr.appendChild(content_td);

        destcity = iflight[mh];
        //loop through fare types to output header
        for (var f = 0; f < farr.length; f++) {
          //console.log(f + ' ' + farr[f] + ' ' + (farr[f] == ''));
          if (farr[f] != '') {
          //console.log(mh + ' ' + f + ' ' + farr[f]);
          content_td = document.createElement('td');
          //console.log(mh + ' ' + iflight[mh] + ' '  + dest + ' ' + f + ' ' + farr[f] + ' ' + destcity[farr[f]]);
          if (destcity[farr[f]] == undefined) {
            flink = '';
            if (this.specialfarelink[f] && (this.specialfarelink[f] != undefined)) {
              flink = this.specialfaretext[f];
            }
            hlink = '';
            if (this.specialfarelink[f] && (this.specialfarelink[f] != undefined)) {
              hlink = this.specialfarelink[f];
              hlink = hlink.replace('%%origin_code%%',this.airportcodes[originsarr[o]]);
              hlink = hlink.replace('%%destination_code%%',dest);
            }
            content_td.innerHTML = '\xa0<a href="' + hlink + '">' + flink + '</a>';
            
          }
          else {
            content_td.innerHTML = destcity[farr[f]]['fare'];
          }
          
          
      
          
          //console.log(content_td.innerHTML);
          content_tr.appendChild(content_td);
        }
      }
      
      if (!this.hidedatevalid ) {
        content_td = document.createElement('td');
        var date = '';
        var datestr = '';

        for (var d = 0;d < destcity['dates'].length; d++) {
          var md = destcity['dates'][d];
          if (md) {
            //fixed internal date format
            if (md.indexOf('.000') > -1) {
              var dd  = md.split(' ')[0].split('-');
              md = parseInt(dd[1],10) + '/' + parseInt(dd[2],10);
              
            }
            date += md + ', ';
          }
        }
        date = this.htmldecode(date.substring(0, date.length - 2));
        if (this.prependdaysofweek ) {
          datestr = destcity['prepend'] + date;
        }
        else {
          datestr = date;
        }
        //console.log(datestr + ' ' + this.dateappendtext);
        datestr += this.dateappendtext;

        content_td.innerHTML = datestr;
        content_tr.appendChild(content_td);
      }
      content_tb.appendChild(content_tr);
        newTable.appendChild(content_tb);
      }

    this.contentdiv.appendChild(newTable);
    this.contentdiv.appendChild(document.createElement('br'));
  }
  }
  this.renderselect = function (selectdiv) {
    var fromdiv = document.getElementById(selectdiv);
    fromdiv.length = 0;
    fromdiv[0] = new Option("All Cities","All",true,true);
    var originsarr = [];
    for (var org in this.origins) {
      if (this.origins.hasOwnProperty(org)) {
        if (org != '') {
          originsarr.push(this.airportnames[org]);
        }
      }
    }
    originsarr.sort();
    
    for (var i = 0; i < originsarr.length;i++) {
      fromdiv[i+1] = new Option(originsarr[i],this.airportcodes[originsarr[i]],false,false);
    }
  }
  this.renderfrom = function(cursel) {
    
    this.render(cursel.value);
  }
}
