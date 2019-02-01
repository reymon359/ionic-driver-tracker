import { Component } from "@angular/core";
import { IonicPage, NavController,AlertController, LoadingController } from "ionic-angular";

  

import {     ViewChild } from "@angular/core";
import { Slides } from "ionic-angular";
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  @ViewChild(Slides)
  slides: Slides;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
              public usuarioProv:UsuarioProvider) { }

  ionViewDidLoad() {
    this.slides.paginationType = 'progress';
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
  }
  mostrarInput(){
    this.alertCtrl.create({
      title: 'Ingrese el usuario',
      inputs:[{
        name:'username',
        placeholder:'Username'
      }],
      buttons:[{
        text: 'Cancelar',
        role: 'cancel'
      },{
        text:'Ingresar',
        //al ser un alert de tipo prompt, en el handler obtendré la data
        handler:data=>{
          this.verificarUsuario(data.username);
        }
      }]
    }).present();
  }
  verificarUsuario(clave: string) {
    let loading = this.loadingCtrl.create({
      content: 'Verificando'
    });
    loading.present();
    this.usuarioProv.verificaUsuario(clave)
      .then(existe => {
        loading.dismiss();

        if (existe) {
          //Si existe el usuario y la promesa devuelve true entonces desbloqueo los slides, 
          //paso al siguiente y los vuelvo a bloquear.
          this.slides.lockSwipes(false);
          this.slides.freeMode = true;
          this.slides.slideNext();
          this.slides.lockSwipes(true);
          this.slides.freeMode = false;

        } else {
          this.alertCtrl.create({
            title: 'Usuario incorrecto',
            subTitle: 'Hable con el administrador o pruebe de nuevo',
            buttons: ['Aceptar']
          }).present();
        }
      })
   
  }
  ingresar(){
    this.navCtrl.setRoot(HomePage);
  }
}
