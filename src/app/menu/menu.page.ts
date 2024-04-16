import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private route: Router,
              private platform: Platform) { }

  ngOnInit() {
    // this.route.navigate(['menu/stabc']);
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      console.log('Carregou');
      this.route.navigate(['menu/stabc']);
    });
  }
}
