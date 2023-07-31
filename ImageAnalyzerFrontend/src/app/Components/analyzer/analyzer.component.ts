import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analyzer',
  templateUrl: './analyzer.component.html',
  styleUrls: ['./analyzer.component.css'],
})
export class AnalyzerComponent {
  public imageURL: any = '';
  public imageFile: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  /**
   * Function called whenever the Image file has been changes or inserted
   */
  ImageChange(event: any) {
    this.imageURL = event.target.file;
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.imageURL = e.target?.result;
      };
    }
  }

  AnalyzeImage() {
    if (this.imageURL != '') {
      const formData = new FormData();
      formData.append("file", this.imageFile, this.imageFile.name);
      
      this.http
        .post('http://localhost:5000/upload', formData)
        .subscribe((resp) => {
          console.log(resp);
        },(err) => {
          console.log("Error")
        });
    }
  }
}
