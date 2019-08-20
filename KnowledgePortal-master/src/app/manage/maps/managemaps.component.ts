// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ConceptMap } from '../../_models/conceptmap.model';
import { Version } from '../../_models/version.model'; //TESTE, APAGAR DEPOIS
import { MergeService, MeService, MapService } from '../../_services/index.service';
import { myDiagram, ConceptMapComponent, resetModel, createModelMerge } from '../../edit/conceptmap/conceptmap.component';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

const idList = []
let dadosMapa;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: ConceptMap[];
  versionIds: Version[];//TESTE, APAGAR DEPOIS
}

declare const $: any;

@Component({
  selector: 'app-manage-maps-cmp',
  templateUrl: 'managemaps.component.html',
  styleUrls: ['./managemaps.component.css']
})

export class ManageMapsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild("map1") map1: ConceptMapComponent;

  @ViewChild('myDiagramDiv') element: ElementRef;

  private mapList: ConceptMap[];
  public dataTable: DataTable;
  public loaded: boolean = false;
  public rendered: boolean = false;
  public isChecked: boolean = true;
  public versionList: Version[]; //TESTE, APAGAR DEPOIS

  public maps: ConceptMap[];

  constructor(private meService: MeService, private router: Router, private mergeService: MergeService, private mapService: MapService) { }

  populate() {
    this.dataTable = {
      headerRow: ['', 'Map_id', 'Version_id', 'Description', 'Other', 'Actions'],
      footerRow: ['', 'Map_id', 'Version_id', 'Description', 'Other', 'Actions'],

      dataRows: this.mapList,
      versionIds: this.versionList //this.mapList[0].versions//TESTE, APAGAR DEPOIS
    };
    this.loaded = true;
  }

  ngOnInit() {
    idList.splice(0, idList.length);

    this.meService.getMaps()
      .subscribe(data => {
        this.mapList = data;
        dadosMapa = data;
        console.log(data);
        //this.populate(); descomentar para testar
        this.meService.getMapsVersions(this.mapList).subscribe(data => {
          this.versionList = data
          this.populate();
        });
      });

  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked() {
    if (this.loaded && !this.rendered) {
      $('#datatables').DataTable({
        "pagingType": "full_numbers",
        "lengthMenu": [
          [10, 25, 50, -1],
          [10, 25, 50, "All"]
        ],
        responsive: true,
        language: {
          search: "_INPUT_",
          searchPlaceholder: "Search records",
        }

      });

      const table = $('#datatables').DataTable();

      // Edit record
      table.on('click', '.edit', function (e) {
        const $tr = $(this).closest('tr');
        const data = table.row($tr).data();
        let titleMapa = "sem nome";
        //console.log("teste" + dadosMapa[]._id)
        dadosMapa.forEach(function (dadoMapa) {
          if(dadoMapa._id == data[1]){
            titleMapa = dadoMapa.title
          }
        })
        alert('TITULO DO MAPA ANAMNESE:'+ titleMapa);
        e.preventDefault();
      });

      // Delete a record
      table.on('click', '.remove', function (e) {
        const $tr = $(this).closest('tr');
        table.row($tr).remove().draw();
        e.preventDefault();
      });

      //Like record
      table.on('click', '.like', function (e) {
        alert('You clicked on Like button');
        e.preventDefault();
      });

      $('.card .material-datatables label').addClass('form-group');
      this.rendered = true;
    }
  }
  change() {
    console.log(this.isChecked);
  }

  newMap(e) {
    e.preventDefault();
    swal({
      title: 'Are you sure?',
      text: "If you have a map not yet saved, this will delete all unsaved information. Do you wish to continue?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes, create a new...',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        resetModel();
        this.router.navigate(['edit', 'cmap']);
      }
    });
  }

  checkCheckBoxvalue(event) {
    if (event.checked == true) {
      idList.push(event.source.id)
      //console.log(event.source.id)
    }
    if (event.checked == false) {
      for (var i = 0; i < idList.length; i++) {
        if (idList[i] == event.source.id) {
          idList.splice(i, 1);
          i = i - 1
        }
      }
    }
  }

  newMerge(e) {
    //console.log(this.versionList)
    //console.log(idList)
    /*this.meService.getMapsVersions(this.mapList).subscribe(data => {
      console.log(data)
    });*/
    e.preventDefault();
    //janela alerta 1 para confirmar a fusao dos mapas
    swal({
      title: 'Are you sure?',
      text: "You are about to do a map merger. Do you wish to continue?",
      type: 'question',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes, merge maps...',
      buttonsStyling: false
    }).then((result) => {
      resetModel();
      /*
              const versionIds={key:[]}
      
              this.versionList.forEach( function(version){
                versionIds.key.push(version._id)
              })
      */

      const body = { versionIds: [] }

      idList.forEach(function (version) {
        body.versionIds.push(
          {
            key: version
          }
        )
      })

     // console.log(JSON.stringify(body))

      this.mergeService.merge(body)

        .subscribe(data => {
          createModelMerge(data);
          //this.router.navigate(['edit','cmap']);

        }, error => console.log(error)
        )


      if (result.value) {
        //janela alerta 2 para informar que a fusao de mapas pode demorar

        swal({
          title: 'Wait while the maps are merged',
          text: "Selected maps are being merged",
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          confirmButtonText: 'Ok...',
          buttonsStyling: false
        }).then((result) => {
          if (result.value) {

            this.router.navigate(['edit', 'cmap']);
          }
        })



      }
    });

  }

}
