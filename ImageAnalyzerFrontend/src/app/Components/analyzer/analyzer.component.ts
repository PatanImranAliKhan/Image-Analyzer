import { Component } from '@angular/core';

@Component({
  selector: 'app-analyzer',
  templateUrl: './analyzer.component.html',
  styleUrls: ['./analyzer.component.css']
})
export class AnalyzerComponent {

  public imageURL: any = "";

  constructor(){}

  ngOnInit() {}

  /**
   * Function called whenever the Image file has been changes or inserted
   */
  ImageChange(event: any) {
    this.imageURL = event.target.file;
    const file:File = event.target.files[0];
    if(file) {
      // this.imageURL = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.imageURL = e.target?.result;
      }
      
      const formData = new FormData();

      formData.append("thumbnail", file);
      console.log(formData);
      
    }
  }

}
