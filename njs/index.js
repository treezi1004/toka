const path = require('path');
const url = require('url');
// IPC Renderer
const { ipcRenderer } = require('electron');
// File System module
const fs = require('fs');
// Dialog module
const {dialog} = require('electron').remote;
const baseDir = String(__dirname).replace(/\\/g, '/').replace('/njs', '');

const animWinBtn = document.getElementById('animWinBtn');
animWinBtn.addEventListener('click', function(){
  ipcRenderer.send('openAnim');
});

(function () {
  var holder = document.getElementById('idle-file');

  holder.ondragover = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  holder.ondragleave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  holder.ondragend = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  holder.ondrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeAllFiles(baseDir + '/img/idle/');
    for (let f of e.dataTransfer.files) {
      if (!f.type.includes('image')) {
        console.log('File(s) must be an image(s)')
        return false;
      }
      // Read and write files asynchronously, otherwise it has to use callback
      fs.readFile(f.path, 'binary', function(err, data){
        var filename = path.basename(f.path);
        fs.writeFile(baseDir + '/img/idle/' + filename, data, 'binary', (err) => {
          if(err) console.log("An error ocurred creating the file " + err.message);
          console.log("The file has been succesfully saved.");
        });
      });
    }
    return false;
  };
})();

(function () {
  var holder = document.getElementById('talk-file');

  holder.ondragover = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  holder.ondragleave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  holder.ondragend = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  holder.ondrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeAllFiles(baseDir + '/img/talk/');
    for (let f of e.dataTransfer.files) {
      if (!f.type.includes('image')) {
        console.log('File(s) must be an image(s)')
        return false;
      }
      // Read and write files asynchronously, otherwise it has to use callback
      fs.readFile(f.path, 'binary', function(err, data){
        var filename = path.basename(f.path);
        fs.writeFile(baseDir + '/img/talk/' + filename, data, 'binary', (err) => {
          if(err) console.log("An error ocurred creating the file " + err.message);
          console.log("The file has been succesfully saved.");
        });
      });
    }
    return false;
  };
})();


function removeAllFiles(directory){
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}
