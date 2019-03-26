MuraFileBrowser = {

config: {
    resourcepath: "User_Assets",
    height: 600,
    selectMode: 0,
    endpoint: '',
    displaymode: 1, // 1: list, 2: grid
    selectCallback: function() {}
}

, prettify: function( tgt ) {

}

, render: function( config ) {
  var self = this;
  var target =  "_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  this.config=Mura.extend(config,this.config);

  this.endpoint = "http://localhost:8080/" + Mura.apiEndpoint + "filebrowser/";
  this.editfilelist = ["txt","cfm","cfc","html","htm","cfml","js","css","json"];
  this.imagelist = ["gif","jpg","jpeg","png"];

  this.container = Mura("#MuraFileBrowserContainer");
  this.container.append("<div id='" + target + "'><component :is='currentView'></component></div>");
  this.target = target;

  this.main(); // Delegating to main()

  Mura.loader()
    .loadjs(
      '/core/modules/v1/filebrowser/assets/js/vue.js',
    function() {
      self.mountbrowser();
     } ) ;

     this.getURLVars();
}

, main: function( config ) {
  var self = this;
}

, onError: function(msg) {
  console.log( msg );
}

, getURLVars: function() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });

    if(vars['CKEditorFuncNum'])
      this.callback = vars['CKEditorFuncNum'];
}

, validate: function() {
  return true;
}

, getEditFile: function( directory,currentFile,onSuccess) {
  var dir = directory == undefined ? "" : directory;
  var baseurl = this.endpoint + "/edit?directory=" + dir + "&filename=" + currentFile.fullname + "&resourcepath=" + this.config.resourcepath;

  if(!this.validate()) {
    return error("No Access");
  }

  Mura.get( baseurl )
    .then(
      //success
      function(response) {
        onSuccess(response);
      },
      //fail
      function(response) {
        this.onError(response);
      }
    );
}

, doDeleteFile: function( directory,currentFile,onSuccess,onError) {
  var dir = directory == undefined ? "" : directory;
  var baseurl = this.endpoint + "/delete?directory=" + dir + "&filename=" + currentFile.fullname + "&resourcepath=" + this.config.resourcepath;

  if(!this.validate()) {
    return error("No Access");
  }

  Mura.get( baseurl )
    .then(
      //success
      function(response) {
        onSuccess(response);
      },
      //fail
      function(response) {
        this.onError(response);
      }
    );
}
, doUpdateContent: function( directory,currentFile,content,onSuccess,onError) {
  var dir = directory == undefined ? "" : directory;
  var baseurl = this.endpoint + "/update?directory=" + dir + "&filename=" + currentFile.fullname + "&resourcepath=" + this.config.resourcepath;

  if(!this.validate()) {
    return error("No Access");
  }

  Mura.post( baseurl,{content: content} )
    .then(
      //success
      function(response) {
        onSuccess(response);
      },
      //fail
      function(response) {
        this.onError(response);
      }
    );
}

, doRenameFile: function( directory,currentFile,onSuccess,onError) {
  var dir = directory == undefined ? "" : directory;
  var baseurl = this.endpoint + "/rename?directory=" + dir + "&filename=" + currentFile.fullname + "&name=" + currentFile.name + "&resourcepath=" + this.config.resourcepath;

  if(!this.validate()) {
    return error("No Access");
  }

  Mura.get( baseurl )
    .then(
      //success
      function(response) {
        onSuccess(response);
      },
      //fail
      function(response) {
        this.onError(response);
      }
    );
}

, doNewFolder: function( directory,newfolder,onSuccess ) {
  var dir = directory == undefined ? "" : directory;
  var baseurl = this.endpoint + "/addfolder?directory=" + dir + "&name=" + newfolder + "&resourcepath=" + this.config.resourcepath;

  if(!this.validate()) {
    return error("No Access");
  }

  Mura.get( baseurl )
    .then(
      //success
      function(response) {
        onSuccess(response);
      },
      //fail
      function(response) {
        onError(response);
      }
    );
}

, loadDirectory: function( directory,pageindex,onSuccess,onError,filterResults,sortOn,sortDir ) {
  var self = this;

  var dir = directory == undefined ? "" : directory;

  var baseurl = this.endpoint + "browse?directory=" + dir + "&resourcepath=" + this.config.resourcepath;

  if(!this.validate()) {
    return error("No Access");
  }

  if(pageindex) {
    baseurl += "&pageindex=" + pageindex;
  }

  if(filterResults.length) {
    baseurl += "&filterResults=" + filterResults;
  }

  Mura.get( baseurl )
    .then(
      //success
      function(response) {
        onSuccess(response);
      },
      //fail
      function(response) {
        onError(response);
      }
    );
}

, loadBaseDirectory: function( onSuccess,onError ) {
  var self = this;
  var baseurl = this.endpoint + "/browse" + "?resourcepath=" + this.config.resourcepath;

  if(!this.validate()) {
    return error("No Access");
  }

  Mura.get( baseurl )
    .then(
      //success
      function(response) {
        onSuccess(response);
      },
      //fail
      function(response) {
        onError(response);
      }
    );
}

, doUpload: function( formData,success,fail ) {
  var self = this;
  var baseurl = this.endpoint + "/upload" + "?resourcepath=" + this.config.resourcepath;

  if(!this.validate()) {
    return error("No Access");
  }

  Mura.post( baseurl,formData )
    .then(
      function doSuccess( response ) {
        success( response );
      },
      function doonError( response ) {
        this.onError(response);
      }
    );
}


, mountbrowser: function() {
  var self = this;

  Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
      el.clickOutsideEvent = function (event) {
        // here I check that click was outside the el and his childrens
        if (!(el == event.target || el.contains(event.target))) {
          // and if it did, call method provided in attribute value
          vnode.context[binding.expression](event);
        }
      };
      document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unbind: function (el) {
      document.body.removeEventListener('click', el.clickOutsideEvent)
    },
  });

  Vue.component('contextmenu', {
    props: ["currentFile","menuy","menux"],
    template: `
    <div id="newContentMenu" class="addNew" v-bind:style="{ left: (menux + 20) + 'px',top: menuy + 'px' }">
        <ul id="newContentOptions">
          <li v-if="checkImageType() && checkSelectMode()"><a @click="selectFile()"><i class="mi-check"> Select</i></a></li>
          <li v-if="checkFileType()"><a  @click="editFile()"><i class="mi-pencil"> Edit</i></a></li>
          <li v-if="checkImageType()"><a  @click="viewFile()"><i class="mi-image"> View</i></a></li>
          <li><a @click="renameFile()"><i class="mi-edit"> Rename</i></a></li>
          <li v-if="checkIsFile()"><a @click="downloadFile()"><i class="mi-download">Download</i></a></li>
          <li><a @click="deleteFile()"><i class="mi-trash"> Delete</i></a></li>
        </ul>
      </div>
    `,
    data() {
        return {
          posx: 0,
          posy: 0
        };
    }
    , computed: {

    }
    , methods: {
      compstyle: function() {
        this.posx = this.menux;
        this.posy = this.menuy;

        return ;
      }

     , selectFile: function() {
        if(MuraFileBrowser.config.selectMode == 1) {
          window.opener.CKEDITOR.tools.callFunction(self.callback,fileViewer.currentFile.url);
          window.close();
        }
        else {
          return MuraFileBrowser.config.selectCallback( fileViewer.currentFile );
        }
      }

      , editFile: function() {
        fileViewer.editFile(this.successEditFile);
      }
      , viewFile: function() {
        fileViewer.isDisplayWindow = "VIEW";
        fileViewer.viewFile();
      }
      , successEditFile: function( response ) {
        this.currentFile.content = response.data.content;
        fileViewer.isDisplayWindow = "EDIT";
      }
      , renameFile: function() {
        fileViewer.isDisplayWindow = "RENAME";
      }
      , downloadFile: function() {
          window.open(fileViewer.currentFile.url, '_blank');
      }
      , deleteFile: function() {
        fileViewer.isDisplayWindow = "DELETE";
      }
      , checkSelectMode: function() {
          return fileViewer.checkSelectMode();
      }
      , checkFileType: function() {
          return fileViewer.checkFileType();
      }
      , checkImageType: function() {
        return fileViewer.checkImageType();
      }
      , checkIsFile: function() {
        return fileViewer.checkIsFile();
      }
    }
  });

  Vue.component('actionwindow', {
    props: ["isDisplayWindow","currentFile","currentIndex","error"],
    template: `
      <div id="actionwindow-wrapper">
        <editwindow v-if="isDisplayWindow=='EDIT'" :currentFile="currentFile"></editwindow>
        <renamewindow v-if="isDisplayWindow=='RENAME'" :currentFile="currentFile"></renamewindow>
        <addfolderwindow v-if="isDisplayWindow=='ADDFOLDER'" :currentFile="currentFile"></addfolderwindow>
        <downloadwindow v-if="isDisplayWindow=='DOWNLOAD'" :currentFile="currentFile"></downloadwindow>
        <deletewindow v-if="isDisplayWindow=='DELETE'" :currentFile="currentFile"></deletewindow>
        <errorwindow v-if="isDisplayWindow=='ERROR'" :currentFile="currentFile" :error="error"></errorwindow>
      </div>
    `,
    data() {
        return {};
    },
    methods: {
    }
  });

  Vue.component('renamewindow', {
    props: ["currentFile"],
    template: `
      <div class="actionwindow-formwrapper">
        <div>
          <h3>Rename</h3>
          <label>
            Name:
            <input v-model="filename"></input>
          </label>
        </div>
        <div>
          <button @click="updateRename()">Save</button>
          <button @click="cancel()">Cancel</button>
        </div>
      </div>
    `,
    data() {
        return {
          filename: ''
        };
    },
    methods: {
      updateRename: function() {
        this.currentFile.name = this.filename;
        fileViewer.renameFile();

        fileViewer.isDisplayWindow = '';
      }
      , cancel: function() {
        fileViewer.isDisplayWindow = '';
      }
    },
    mounted: function() {
      this.filename = this.currentFile.name;
    }
  });

  Vue.component('errorwindow', {
    props: ['error'],
    template: `
      <div class="actionwindow-formwrapper">
        <div>
          <h3>Error</h3>
          <h4>{{error}}</h4>
        </div>
        <div>
          <button @click="cancel()">Close</button>
        </div>
      </div>
    `,
    data() {
        return {
          filename: ''
        };
    },
    methods: {
      cancel: function() {
        fileViewer.isDisplayWindow = '';
      }
    }
  });


  Vue.component('addfolderwindow', {
    props: ["currentFile"],
    template: `
      <div class="actionwindow-formwrapper">
        <div>
          <h3>Add Folder</h3>
          <label>
            Name:
            <input v-model="foldername"></input>
          </label>
        </div>
        <div>
          <button @click="newFolder()">Save</button>
          <button @click="cancel()">Cancel</button>
        </div>
      </div>
    `,
    data() {
        return {
          foldername: ''
        };
    },
    methods: {
      newFolder: function() {
        fileViewer.newFolder(this.foldername);

        fileViewer.isDisplayWindow = '';
      }
      , cancel: function() {
        fileViewer.isDisplayWindow = '';
      }
    },
    mounted: function() {

    }
  });

  Vue.component('viewwindow', {
    props: ["currentFile","currentIndex","total"],
    template: `
      <div class="fileviewer-modal">
        <div>
          <div class="fileviewer-gallery" :style="{ 'background-image': 'url(' + currentFile.url + ')' }"  v-click-outside="closewindow">
            <div>
              <div class="actionwindow-left" @click="lastimage"><i class="mi-caret-left"></i></div>
              <div class="actionwindow-right" @click="nextimage"><i class="mi-caret-right"></i></div>
              <div class="fileviewer-gallery-menu">
                <ul>
                  <li v-if="checkImageType() && checkSelectMode()"><a @click="selectFile()"><i class="mi-check"> Select</i></a></li>
                  <li v-if="checkFileType()"><a  @click="editFile()"><i class="mi-pencil"> Edit</i></a></li>
                  <li><a @click="renameFile()"><i class="mi-edit"> Rename</i></a></li>
                  <li v-if="checkIsFile()"><a @click="downloadFile()"><i class="mi-download">Download</i></a></li>
                  <li><a @click="deleteFile()"><i class="mi-trash"> Delete</i></a></li>
                  <li><a @click="closewindow()"><i class="mi-times">Close</i></a></li>
                </ul>
                <p>{{currentFile.name}} ({{currentFile.size}}k)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
        return {};
    }
    , mounted: function() {
      this.$root.isDisplayContext = 0;
    }
    , methods: {
      lastimage: function() {
        fileViewer.previousFile(1);
      }
      , nextimage: function() {
        fileViewer.nextFile(1);
      }
      , closewindow: function( event ) {
        this.$root.isDisplayWindow = "";
      }
      , renameFile: function() {
        fileViewer.isDisplayWindow = "RENAME";
      }
      , downloadFile: function() {
          window.open(fileViewer.currentFile.url, '_blank');
      }
      , deleteFile: function() {
        fileViewer.isDisplayWindow = "DELETE";
      }
      , checkSelectMode: function() {
          return fileViewer.checkSelectMode();
      }
      , checkFileType: function() {
          return fileViewer.checkFileType();
      }
      , checkImageType: function() {
        return fileViewer.checkImageType();
      }
      , checkIsFile: function() {
        return fileViewer.checkIsFile();
      }

    }
  });

  Vue.component('deletewindow', {
    props: ["currentFile"],
    template: `
      <div class="actionwindow-formwrapper">
        <h3>Delete</h3>
        <label>
          <p>Confirm Deletion: {{currentFile.name}}</p>
          <button @click="doDelete()">Delete</button>
          <button @click="cancel()">Cancel</button>
        </label>
      </div>
    `,
    data() {
        return {};
    },
    methods: {
      doDelete: function() {
        fileViewer.deleteFile(  fileViewer.refresh, fileViewer.displayError );
        fileViewer.isDisplayWindow = '';
      }
      , cancel: function() {
        fileViewer.isDisplayWindow = '';
      }
    }
  });

  Vue.component('editwindow', {
    props: ["currentFile"],
    template: `
      <div class="actionwindow-formwrapper">
        <h3>Edit</h3>
        <label>
          <textarea class="editwindow prettyprint" v-model="filecontent"></textarea>
          <button @click="updateContent()">Update</button>
          <button @click="cancel()">Cancel</button>
        </label>
      </div>
    `,
    data() {
        return {
          filecontent: ''
        };
    },
    methods: {
      updateContent: function() {
        console.log(this.filecontent);
        fileViewer.updateContent(this.filecontent);
        fileViewer.isDisplayWindow = '';
      }
      , cancel: function() {
        fileViewer.isDisplayWindow = '';
      }
    }
    , mounted: function() {
      this.filecontent = this.currentFile.content;
    }
  });

  Vue.component('appbar', {
    props: ["links","isbottomnav","response","itemsper","location"],
    template: `
      <div class="filewindow-appbar">
          <navmenu v-if="response.links" :links="links" :response="response" :itemsper="itemsper" :isbottomnav="isbottomnav"></navmenu>
          <modemenu v-if="location"></modemenu>
      </div>
    `,
    data() {
        return {};
    },
    methods: {
      applyPage: function(goto) {
          var pageindex = 1;

          if(goto == 'last') {
            pageindex = parseInt(fileViewer.response.totalpages);
          }
          else if(goto == 'next') {
            pageindex = parseInt(fileViewer.response.pageindex) + 1;
          }
          else if(goto == 'previous') {
            pageindex = parseInt(fileViewer.response.pageindex) - 1;
          }

          this.$parent.refresh('',pageindex)
      }
      , applyItemsPer: function() {
        this.$parent.itemsper = this.itemsper;
      }
    }

  });

  Vue.component('modemenu', {
    props: ["links","isbottomnav","response","itemsper","displaymode"],
    template: `
        <div class="filewindow-modemenu">
          <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-secondary" v-bind:class="{ highlight: viewmode == 1 }" @click="switchMode(1)">
              <i class="mi-th" title="Grid View"></i>
            </label>
            <label class="btn btn-secondary" v-bind:class="{ highlight: viewmode == 2 }" @click="switchMode(2)">
              <i class="mi-bars" title="List View"></i>
            </label>
          </div>
          <label @click="newFolder" class="btn btn-secondary">
            <i class="mi-folder" title="Add Folder"></i>
          </label>
          <input v-model="filterResults" v-on:input="filterChange">
        </div>
    `,
    data() {
        return {
          viewmode: this.$root.displaymode,
          filterResults: '',
          timeout: undefined
        };
    },
    methods: {
      switchMode: function(mode) {
        this.$root.displaymode = this.viewmode = mode;

      }
      , newFolder: function() {
        fileViewer.isDisplayWindow = 'ADDFOLDER';
      }
      , filterChange: function(e,value) {
        // timeout to allow for typing and not fire immediately
        if(this.timeout)
          window.clearTimeout(this.timeout);

        this.$root.filterResults = this.filterResults;
        this.timeout = window.setTimeout(this.$root.refresh, 500);
      }
    }

  });

  Vue.component('navmenu', {
    props: ["links","isbottomnav","response","itemsper"],
    template: `
        <div class="filewindow-navmenu">
          <p v-if="isbottomnav">
          {{response.pageindex}} of {{response.totalpages}} <!-- ({{response.totalitems}}) includes folders -->
          </p>
        <ul class="pagination">
          <li><a v-if="links.first" @click="applyPage('first')">
            <i class="mi-angle-double-left"></i>
          </a></li>
          <li><a v-if="links.previous" @click="applyPage('previous')">
            <i class="mi-angle-left"></i>
          </a></li>
          <li><a v-if="links.next" @click="applyPage('next')">
            <i class="mi-angle-right"></i>
          </a></li>
          <li><a v-if="links.last" @click="applyPage('last')">
            <i class="mi-angle-double-right"></i>
          </a></li>

          <li class="pull-right">
            <select name="itemsper" class="itemsper" @change="applyItemsPer" v-model="itemsper">
              <option value='10' :selected="itemsper == 10 ? 'selected' : null">10</option>
              <option value='20' :selected="itemsper == 20 ? 'selected' : null">20</option>
              <option value='50' :selected="itemsper == 50 ? 'selected' : null">50</option>
            </select>
          </li>

        </ul>
      </div>
    `,
    data() {
        return {};
    },
    methods: {
      applyPage: function(goto) {
          var pageindex = 1;

          if(goto == 'last') {
            pageindex = parseInt(fileViewer.response.totalpages);
          }
          else if(goto == 'next') {
            pageindex = parseInt(fileViewer.response.pageindex) + 1;
          }
          else if(goto == 'previous') {
            pageindex = parseInt(fileViewer.response.pageindex) - 1;
          }

          this.$root.refresh('',pageindex)
      }
      , applyItemsPer: function() {
        this.$root.itemsper = this.itemsper;
      }
    }

  });


  Vue.component('listmode', {
    props: ['files','folders','foldertree','isDisplayContext','currentFile'],
    template: `
      <div class="listmode-wrapper">
        <table class="mura-table-grid">
        	<tbody>
        		<tr>
        			<th class="actions"></th>

        			<th class="var-width">Filename</th>
        			<th>Size</th>
        			<th>Modified</th>
        		</tr>
            <tr v-if="foldertree.length">
              <td>
                <a  @click="back()">
                  &nbsp;
                  <i class="mi-arrow-up"></i>
                </a>
              </td>
            </tr>
        		<tr v-for="(file,index) in files">
        			<td class="actions">
        				<a :id="'fileitem-'+index" class="show-actions" @click="openMenu($event,file,index)"><i class="mi-ellipsis-v"></i></a>
        				<div class="actions-menu hide">
        					<ul class="actions-list">
        						<li class="edit"><a @contextmenu="openMenu($event,file,index)"><i class="mi-pencil"></i>View</a></li>
        					</ul>
        				</div>
        			</td>
        			<td class="var-width" v-if="parseInt(file.isfile)">
                  {{file.name}}
              </td>
              <td class="var-width" v-else>
                <a  @click="refresh(file.name)">
                <i class="mi-folder"></i> {{file.name}}
                </a>
              </td>
        			<td>
                <i v-if="parseInt(file.isfile)">
        					{{file.size}}K
                </i>
        			</td>
        			<td>
        					{{file.lastmodifiedshort}}
        			</td>
        		</tr>


        	</tbody>
        </table>
        <contextmenu :currentFile="this.$parent.currentFile" :isDisplayContext="this.$root.isDisplayContext" v-if="isDisplayContext" :menux="menux" :menuy="menuy"></contextmenu>
      </div>`,
    data() {
      return {
        menux: 0,
        menuy: 0
      }
    }
    , methods: {
      refresh: function( directory,index ) {
        this.$root.refresh( directory,index );
      }
      , displayError: function( e ) {
        this.$root.displayError( e );
      }
      ,back: function( ) {
        this.$root.back( );
      }
      ,openMenu: function(e,file,index,ref) {

        this.$root.isDisplayContext = 0;

        if(this.$root.contextListener) {
        }

        var left = Math.floor(document.getElementById('fileitem-'+index).getBoundingClientRect().left) - 26;
        var top =  Math.floor(document.getElementById('fileitem-'+index).getBoundingClientRect().top);

        this.$nextTick(function () {
          this.$root.isDisplayContext = 1;
        });

        this.$root.isDisplayWindow = '';
        this.$root.currentFile = file;
        this.$root.currentFile.index = index;
        this.$root.currentIndex = index;
        this.menux = left;
        this.menuy = top;

        e.preventDefault();
      }
    }
  });

  Vue.component('gridmode', {
    props: ['files','folders','foldertree','isDisplayContext','currentFile'],
    template: `
      <div class="gridmode-wrapper">
        <div v-if="foldertree.length" class="fileviewer-item" @click="back()">
          <div class="fileviewer-image">
            <i class="mi-arrow-left" style="font-size: 7em"></i>
          </div>
          <div class="fileviewer-label">
            Back
          </div>
        </div>
        <div v-for="(file,index) in files">
          <div class="fileviewer-item"  :id="'fileitem-'+index"  v-if="parseInt(file.isfile)" @click="openMenu($event,file,index)">
            <div class="fileviewer-image">
              <div v-if="0" class="fileviewer-icon" :class="['fileviewer-icon-' + file.type]"></div>
              <div v-else class="fileviewer-icon" :style="{ 'background-image': 'url(' + file.url + ')' }"></div>
            </div>
            <div class="fileviewer-label">
              {{file.name}}
            </div>
          </div>
          <div class="fileviewer-item" v-else @click="refresh(file.name)">
            <div class="fileviewer-image">
              <i class="mi-folder" style="font-size: 7em;color: #333"></i>
            </div>
            <div class="fileviewer-label">
              {{file.name}}
            </div>
          </div>
        </div>
        <contextmenu :currentFile="this.$parent.currentFile" :isDisplayContext="isDisplayContext" v-if="isDisplayContext" :menux="menux" :menuy="menuy"></contextmenu>
      </div>`,
    data() {
      return {
          menux: 0,
          menuy: 0,
          offsetx: 0,
          offsety: 0
      }
    }
    , methods: {
      refresh: function( directory,index ) {
        this.$root.refresh( directory,index );
      }
      ,back: function( ) {
        this.$root.back( );
      }
      ,openMenu: function(e,file,index) {
        this.menux = Math.floor(document.getElementById('fileitem-'+index).getBoundingClientRect().left)+5;
        this.menuy =  Math.floor(document.getElementById('fileitem-'+index).getBoundingClientRect().top)+10;

        this.$nextTick(function () {
          this.$root.isDisplayContext = 1;
        })

        this.$root.isDisplayWindow = '';
        this.$root.currentFile = file;
        this.$root.currentFile.index = index;
        this.$root.currentIndex = index;

        e.preventDefault();
      }
    }
  });

  Vue.component('filewindow', {
    props: ['files','folders','foldertree','isDisplayContext','currentFile','','displaymode'],
    template: `
      <div class="filewindow-wrapper">
        <gridmode v-if="displaymode==1" :currentFile="currentFile"   :foldertree="foldertree" :files="files" :folders="folders" :isDisplayContext="isDisplayContext"></gridmode>
        <listmode  v-if="displaymode==2" :currentFile="currentFile" :foldertree="foldertree" :files="files" :folders="folders" :isDisplayContext="isDisplayContext"></listmode>
      </div>`,
    data() {
      return {};
    },
    methods: {

    }
  });

  const IS_START = 0, IS_SAVE = 1, IS_SUCCESS = 2, IS_FAIL = 3;

  var fileViewer = new Vue({
    el: "#" + self.target,
    template: `
      <div class="fileviewer-wrapper">
        <viewwindow v-if="isDisplayWindow=='VIEW'" :currentFile="currentFile" :currentIndex="currentIndex"></viewwindow>
        <actionwindow v-if="isDisplayWindow" :isDisplayWindow="isDisplayWindow" :currentIndex="currentIndex" :currentFile="currentFile" :error="error"></actionwindow>
        <div class="fileviewer-breadcrumb">
          <i class="mi-home" @click="setDirDepth(-1)"></i>
          <i v-for="(item,index) in foldertree" class="mi-angle-double-right fa-padleft" @click="setDirDepth(index)"> {{item}}</i>
        </div>
        <div class="fileviewer-droptarget">
          <form enctype="multipart/form-data" novalidate v-if="isStart || isSave">
            <input type="file" multiple :name="uploadField" :disabled="isSave" @change="filesChanged($event.target.name, $event.target.files);" accept="*.*" class="file-input-field">
            <p v-if="isStart" class="upload-icon">
              <strong>Drag</strong> your files here, or <strong>click</strong> to browse...
            </>
            <p v-if="isSave" class="download-icon">
              Uploading {{fileCount}} files...
              <ul class="fileviewer-uploadedfiles">
                <li v-for="file in uploadedFiles">
                  {{file.name}} ({{Math.floor(file.size/1000)}}k)
                </li>
              </ul>
            </p>
          </form>
        </div>
        <appbar v-if="response.links" :location=1 :links="response.links" :itemsper="itemsper" :response="response"></appbar>
        <filewindow :currentFile="currentFile" :isDisplayContext="isDisplayContext" :foldertree="foldertree" :files="files" :folders="folders" :displaymode="displaymode"></filewindow>
        <appbar v-if="response.links" :location=0 :links="response.links" :itemsper="itemsper" :response="response"></appbar>
      </div>`
    ,
    data: {
      currentView: 'fileviewer',
      currentState: null,
      currentFile: null,
      currentIndex: 0,
      foldertree: [],
      fileCount: 0,
      files: [],
      folders: [],
      error: "",
      displaymode: this.config.displaymode,
      uploadedFiles: [],
      isDisplayContext: 0,
      isDisplayWindow: '',
      uploadField: "uploadFiles",
      filterResults: '',
      sortOn: '',
      sortDir: 'ASC',
      itemsper: 10,
      editfilelist: self.editfilelist,
      response: {pageindex: 0}
    },
    ready: function() {
    },
    computed: {
      isStart() {
        return this.currentState === IS_START;
      },
      isSave() {
        return this.currentState === IS_SAVE;
      },
      isSuccess() {
        return this.currentState === IS_SUCCESS;
      },
      isonError() {
        return this.currentState === IS_FAIL;
      }
    },
    methods: {
      updateDelete: function() {
          self.updateDelete(currentFile);
      }
      , updateContent: function( content ) {
        var dir = "";

        for(var i=0;i<this.foldertree.length;i++) {
          dir = dir + "\\" + this.foldertree[i];
        }

        self.doUpdateContent( dir,this.currentFile,content,this.refresh );
      }
      , renameFile: function() {
        var dir = "";

        for(var i=0;i<this.foldertree.length;i++) {
          dir = dir + "\\" + this.foldertree[i];
        }

          self.doRenameFile( dir,this.currentFile,this.refresh );
      }
      , newFolder: function(foldername) {
        var dir = "";

        for(var i=0;i<this.foldertree.length;i++) {
          dir = dir + "\\" + this.foldertree[i];
        }
        self.doNewFolder( dir,foldername,this.refresh );
      }
      , updateEdit: function() {
          self.updateEdit(currentFile);
      }
      , displayResults: function(response) {
        this.response = response.data;
        this.files = response.data.items;
        this.folders = response.data.folders;
      }
      , displayError: function( e ) {
      }
      , previousFile( img ) {
        img = img ? img : 0;
        index = this.currentIndex;

        index--;

        if(index+1 <= 0) {
          return;
        }

        if(!parseInt(this.files[index].isfile)) {
          return;
        }

        if(img && this.checkImageType() || !img) {
          this.currentFile = this.files[index];
          this.currentIndex = index;

          return;
        }
        else {
          this.previousFile(img);
        }

      }
      , nextFile( img ) {
        img = img ? img : 0;
        index = this.currentIndex;

        index++;

        if(index >= this.files.length) {
          return;
        }

        if(img && this.checkImageType() || !img) {
          this.currentFile = this.files[index];
          this.currentIndex = index;
          return;
        }
        else {
          this.nextFile(img);
        }
      }
      , upload: function() {
      }
      , uploadReset() {
        this.currentState = IS_START;
        this.uploadedFiles = [];
        this.error = null;
      }
      , setDirDepth: function( depth ) {
          this.foldertree = this.foldertree.slice(0,depth+1);
          this.refresh();
      }
      , editFile: function( onSuccess,onError ) {
        var dir = "";

        for(var i=0;i<this.foldertree.length;i++) {
          dir = dir + "\\" + this.foldertree[i];
        }

        self.getEditFile(dir,this.currentFile,onSuccess);

      }
      , viewFile: function( direction ) {

      }
      , deleteFile: function( onSuccess, onError) {
        var dir = "";

        for(var i=0;i<this.foldertree.length;i++) {
          dir = dir + "\\" + this.foldertree[i];
        }

        self.doDeleteFile(dir,this.currentFile,onSuccess,onError);

      }
      , refresh: function( folder,pageindex ) {
        if(folder && folder.length)
          this.foldertree.push(folder);

        var dir = "";

        isNaN(pageindex) ? 0 : pageindex;

        for(var i=0;i<this.foldertree.length;i++) {
          dir = dir + "\\" + this.foldertree[i];
        }

        self.loadDirectory(dir,pageindex,this.displayResults,this.displayError,this.filterResults,this.sortOn,this.sortDir);
      }
      , back: function() {
        this.foldertree.splice(-1);
        var folder = this.foldertree.length ? "" : this.foldertree[this.foldertree.length-1];
        this.refresh();
      }
      , closeMenu: function( e ) {
        this.isDisplayContext = 0;
        e.preventDefault();
      }
      , filesChanged: function(fieldName, fileList) {
        // handle file changes

        this.uploadedFiles = fileList;

        const formData = new FormData();

        var dir = "";

        if (!fileList.length) return;

        // append the files to FormData

        this.fileCount = fileList.length;

        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(fieldName, fileList[x], fileList[x].name);
          });

        for(var i=0;i<this.foldertree.length;i++) {
          dir = dir + "\\" + this.foldertree[i];
        }

        formData.append("directory",dir);

        // save it
        this.save(formData);
      }
      , save: function( formData ) {
          this.currentState = IS_SAVE;

          self.doUpload( formData,this.saveComplete );
      }
      , saveComplete: function( ) {
        this.uploadReset();
        this.refresh();
      }
      , checkSelectMode: function() {
        return MuraFileBrowser.config.selectMode;
      }
      , checkFileType: function() {
          for(var i = 0;i<self.editfilelist.length;i++) {
            if(this.currentFile.ext == self.editfilelist[i]) {
              return true;
            }
          }
          return false;
      }
      , checkImageType: function() {
          for(var i = 0;i<self.imagelist.length;i++) {
            if(this.currentFile.ext == self.imagelist[i]) {
              return true;
            }
          }
          return false;
      }
      , checkIsFile: function() {

        if(Math.floor(this.currentFile.isfile)) {
          return true;
        }
        return false;
      }
    },
    mounted: function() {
        this.uploadReset();
        this.selectMode = self.config.selectMode;
        self.loadBaseDirectory(this.displayResults,this.displayError);
        window.addEventListener('mouseup', function(event) {
          fileViewer.isDisplayContext = 0;
        });
        var vm = this;
    }
  });
}

};
