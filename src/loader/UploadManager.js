import ResourcesManager from "../resources/ResourcesManager";

export default new class UploadManager {
    constructor() {
        this.filesCount = 0;
        this.filseData = [];

        //this.init();
    }

    init() {
        this.dropArea = document.getElementById('canvas');
        this.dropAreaHighlight = document.getElementById('dropArea');

        this.addListeners();
    }

    addListeners() {
        this.dropArea.addEventListener('dragenter', this.onDragEnter.bind(this), false);
        this.dropArea.addEventListener('dragleave', this.onDropLeave.bind(this), false);
        this.dropArea.addEventListener('dragover', this.onDragOver.bind(this), false);
        this.dropArea.addEventListener('drop', this.onDrop.bind(this), false);
    }

    handlerFunction(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDragEnter(event) {
        if (event.dataTransfer.effectAllowed === 'copy' ||
            event.dataTransfer.effectAllowed === 'copyMove') {
            return;
        }
        event.preventDefault();
        //event.stopPropagation();
        this.dropAreaHighlight.classList.add('highlight');
    }

    onDragOver(event) {
        if (event.dataTransfer.effectAllowed === 'copy' ||
            event.dataTransfer.effectAllowed === 'copyMove') {
            return;
        }
        event.preventDefault();
        //event.stopPropagation();
        this.dropAreaHighlight.classList.add('highlight');
    }

    onDropLeave(event) {
        if (event.dataTransfer.effectAllowed === 'copy' ||
            event.dataTransfer.effectAllowed === 'copyMove') {
            return;
        }
        event.preventDefault();
        //event.stopPropagation();
        this.dropAreaHighlight.classList.remove('highlight');
    }

    onDrop(event) {
        if (event.dataTransfer.effectAllowed === 'copy' ||
            event.dataTransfer.effectAllowed === 'copyMove') {
            return;
        }
        event.preventDefault();
        //event.stopPropagation();
        this.dropAreaHighlight.classList.remove('highlight');

        this.getFilesData(event);
    }

    getFilesData(data) {
        let dt = data.dataTransfer;
        let files = dt.files;

        this.handleFiles(files);
    }

    handleFiles(data) {
        this.filseData = [];
        this.filesCount = data.length;
        for (let i = 0; i < data.length; i++) {
            this.loadFile(data[i]);
        }
    }

    loadFile(file) {
        console.log(`[UploadManager] Loading complete: ${file.name}`);
        ResourcesManager.addResource(file.name, file);
        /*createImageBitmap(file).then((imageBitmap)=>{
             ResourcesManager.addTexture(file.name, imageBitmap);
        });*/
        //ResourceLoader.resources[file.name] = createImageBitmap(file);
    }

    /*loadFile(file) {
        let fileReader = new FileReader();
        fileReader.addEventListener('loadend', this.loadingFileComplete(file), false);
        fileReader.readAsDataURL(file);
        //fileReader.readAsArrayBuffer(file);
        //fileReader.readAsBinaryString(file);
        //fileReader.readAsText(file);
    }

    loadingFileComplete(file) {
        return (event) => {
            this.filseData.push({name: file.name, data: event.target.result});
            this.checkForAllLoaded();
        }
    }

    checkForAllLoaded() {
        this.filesCount--;
        if (this.filesCount === 0) {
            //GlobalDispatcher.dispatch('uploadManager:allFilesLoaded', this.filseData);
        }
    }*/
}()
