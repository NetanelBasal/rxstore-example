import {Directive, ElementRef} from "@angular/core";

declare const photon: any;

@Directive({
  selector: "[photon]"
})
export class PhotonDirective {

  constructor(private host: ElementRef) {
  }

  ngAfterViewInit() {

  }
}

