# Image-Analyzer
Developed the Project Using AngularJS(version: 16.1.6) for the Frontend Development and NodeJS(version: 18.16.0) for the Backend API Development.

# Pre-requisite
Angulat CLI and NodeJS with latest version

Latest Visual Studio 2019+ community edition installed with Common Tools for Visual C++ during setup. [Link](https://visualstudio.microsoft.com/vs/)

# 3 Different methods to run the code
## Method-1 : Run application through both Frontend Angular and Backend NodeJS

Step-1: open cmd and clone the git repository. Command:  `git clone https://github.com/PatanImranAliKhan/Image-Analyzer.git`

Step-2: move to cloned Directory folder. Command: `cd Image-Analyzer`

Step-3: move to backend directory. Command: `cd ImageAnalyzerBackend` and run `npm install`

Step-4: Run the backend Nodejs application by using the command `npm start`.

Step-5: Open new cmd or terminal and navigate to frontend directory. Command: `cd ImageAnalyzerFrontend` and run `npm install`

Step-6: Open Components\analyzer\analyzer.component.ts file and change the URL in line 42 into `http://localhost:5000/api/upload` and save the File.

Step-7: Run the frontend application by using `ng serve`.

Step-8: Test application by opening the following URL in browser `http://localhost:4200/`

## Method-2 :  Run Application through only Nodejs backend Application

Step-1: Open cmd and clone the git repository. Command:  `git clone https://github.com/PatanImranAliKhan/Image-Analyzer.git`

Step-2: Move to cloned directory and Backend folder. Command: `cd Image-Analyzer/ImageAnalyzerBackend`

Step-3: Install the dependencies. Command: `npm install`.

Step-4: Run the application. Command: `npm start`

Step-5: Test application by opening the following URL in browser `http://localhost:5000/`

## Method-3 : Run Full Stack application through Docker

To use this method, you must have latest version of Docker installed in your PC.

Step-1: Open cmd and pull published image through command: `docker pull imranalikhan/image-analyzer:0.0.1`

Step-2: After successful pull, run the conatiner image through command `docker run -d -p 5000:5000 imranalikhan/image-analyzer:0.0.1`

Step-3: Test application by opening the following URL in browser `http://localhost:5000/`
