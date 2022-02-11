let deleteModal = '';
let productModal = '';
const app = Vue.createApp({
    data(){
        return{
            url: 'https://vue3-course-api.hexschool.io/v2',
            path: 'immigrant524',
            products: [],
            pagination: {},
            temp: '',
        }
    },
    methods:{
        // page 是用query去帶
        getProducts(page){ // 取資料
            // console.log(page);
            axios.get(`${this.url}/api/${this.path}/admin/products/?page=${page}`)
            .then(res=>{
                // console.log(res.data.products);
                this.products = [...res.data.products,];
                this.pagination=res.data.pagination;
              
                console.log(res);
                
            })
            .catch(rej=>{
                console.dir(rej)
            })
        },
        Authorization(){
            //取出 token
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token; // 認證

            axios.post(`${this.url}/api/user/check`) // 檢查有無過期，沒成功回 login 頁面
            .then(res=>{
                this.getProducts(); // 認證成功取資料
            })
            .catch(err=>{
                window.location='login.html';
            })

        },
        openModal(Modal,DataStatus,item){ // 開啟產品 Modal
            // console.log(item);
            if(item){
                this.temp= JSON.parse(JSON.stringify(item));
            }else{
                this.temp={}
            }
            // this.temp= JSON.parse(JSON.stringify(item));
            this.temp.status= DataStatus ;  // 將資料狀態寫入
            if(Modal=='productMoal'){
                      // 將資料另外放入 temp
                if(!this.temp.imagesUrl){
                    this.temp.imagesUrl= [];
                }
                
                productModal.show();
            }
            else if(Modal=="deleteModal"){
              
                deleteModal.show();
            }
            
        },
        createOrEditData(temp){  // 建立或編輯新資料
            console.log('temp',temp);
            let method= 'post';     // 預設方法為新增
            let method_url = `${this.url}/api/${this.path}/admin/product`;  // 新增的url

            if(temp.status== "exist"){   // 判斷是編輯資料
                const id = temp.id;      // 取出資料id
                 method= 'put';         // 將方法修改成編輯api的put
                 method_url = `${this.url}/api/${this.path}/admin/product/${id}`;  // 編輯的 url
            }
          
            axios[method](`${method_url}`,{data: temp})  // 依照新增或編輯帶入相對應 方法與url
            .then(res=>{
                alert('更新完成');
                this.getProducts();   // 更新畫面
            })
            .catch(rej=>{
               
                alert(rej.data.message)
            })
            productModal.hide();
        },
        closeModal(ModalStatus){  // 關閉視窗，判斷是 商品視窗或刪除視窗
            // console.log(ModalStatus);
            if(ModalStatus=="closeProductModal"){
                this.temp= '',
                productModal.hide();
            }
            else if(ModalStatus=="closeDeleteModal"){
                this.temp= '',
                deleteModal.hide();
            }
           
        },
        deleteData(temp){   // 刪除資料 api
            const id = temp.id;
           
            axios.delete(`${this.url}/api/${this.path}/admin/product/${id}`)
            .then(res=>{
                // console.log(res);
                deleteModal.hide();
                alert('刪除完成');
                this.getProducts();
            })
            .catch(rej=>{
             
                deleteModal.hide();
            })
        },
       

    },
    mounted(){
        this.Authorization();
        deleteModal =  new bootstrap.Modal(document.querySelector('#delProductModal'));
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
    }
    
});

app.component('deleteModal',{
  data(){
    return{
      url: 'https://vue3-course-api.hexschool.io/v2',
      path: 'immigrant524',
    }
  },
  methods:{
    deleteData(temp){   // 刪除資料 api
      const id = temp.id;
     
      axios.delete(`${this.url}/api/${this.path}/admin/product/${id}`)
      .then(res=>{
          // console.log(res);
          deleteModal.hide();
          alert('刪除完成');
          this.$emit('getProducts');
      })
      .catch(rej=>{
       
          deleteModal.hide();
      })
  }

  },
  props: ['temp'],
  template:`<div class="modal-dialog">
  <div class="modal-content border-0">
    <div class="modal-header bg-danger text-white">
      <h5 id="delProductModalLabel" class="modal-title">
        <span>刪除產品</span>
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      是否刪除
      <strong class="text-danger"></strong>  <span class="text-danger" v-text="temp.title"></span>(刪除後將無法恢復)。
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="closeModal('closeDeleteModal')">
        取消
      </button>
      <button type="button" class="btn btn-danger" @click="deleteData(temp)">
        確認刪除
      </button>
    </div>
  </div>
</div>`
})

app.component('productModal',{
    data(){
        return{
            url: 'https://vue3-course-api.hexschool.io/v2',
            path: 'immigrant524',
        }
    },
    methods:{
      
       createOrEditData(temp){  // 建立或編輯新資料
        
        // console.log('temp',temp);
        let method= 'post';     // 預設方法為新增
        let method_url = `${this.url}/api/${this.path}/admin/product`;  // 新增的url

        if(temp.status== "exist"){   // 判斷是編輯資料
            const id = temp.id;      // 取出資料id
             method= 'put';         // 將方法修改成編輯api的put
             method_url = `${this.url}/api/${this.path}/admin/product/${id}`;  // 編輯的 url
        }
        console.log(method,method_url);
        axios[method](`${method_url}`,{data: temp})  // 依照新增或編輯帶入相對應 方法與url
        .then(res=>{
            alert('更新完成');
            this.$emit('getProducts');   // 更新畫面
        })
        .catch(rej=>{
           
            alert(rej.data.message)
        })
        productModal.hide();
    },
    },
    props: ['temp'],
    template:` 
    <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">

          <span v-if="temp.status=='new'">新增產品</span>
          <span v-else> 編輯產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-2">
              <div class="mb-3">
                <label for="imageUrl" class="form-label">主要圖片</label>
                <input type="text" class="form-control"
                       placeholder="請輸入圖片連結" v-model="temp.imageUrl">
              </div>
              <img class="img-fluid" :src="temp.imageUrl" alt="">
            </div>

            <div class="mb-2">
              <div class="mb-3">
                <label for="imageUrl" class="form-label">多圖新增</label>
          
                
                <div v-for="(item,i) in temp.imagesUrl">
                 
                  <input type="text" class="form-control"  placeholder="請輸入圖片連結" v-model="temp.imagesUrl[i]" >
                  <img  class="img-fluid" :src="item" alt="">
                </div>
              </div>
            </div>


            
            <div>
              <input type="text" class="form-control"  placeholder="請輸入圖片連結" v-model="temp.img">
              <button class="btn btn-outline-primary btn-sm d-block w-100" @click=" temp.imagesUrl.push(temp.img); ">
                新增圖片
              </button>
            </div>
            <div>
              <button class="btn btn-outline-danger btn-sm d-block w-100" @click=" temp.imagesUrl.pop('')">
                刪除圖片
              </button>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="mb-3">
              <label for="title" class="form-label">標題</label>
              <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="temp.title">
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="category" class="form-label">分類</label>
                <input id="category" type="text" class="form-control"
                       placeholder="請輸入分類" v-model="temp.category">
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">單位</label>
                <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="temp.unit">
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="origin_price" class="form-label" >原價</label>
                <input id="origin_price" type="number" min="0" class="form-control" v-model="temp.origin_price" placeholder="請輸入原價">
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">售價</label>
                <input id="price" type="number" min="0" class="form-control"
                       placeholder="請輸入售價" v-model="temp.price">
              </div>
            </div>
            <hr>

            <div class="mb-3">
              <label for="description" class="form-label">產品描述</label>
              <textarea id="description" type="text" class="form-control"
                        placeholder="請輸入產品描述" v-model="temp.content">
              </textarea>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">說明內容</label>
              <textarea id="description" type="text" class="form-control"
                        placeholder="請輸入說明內容"  v-model="temp.description">
              </textarea>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input id="is_enabled" class="form-check-input" type="checkbox"
                       :true-value="1" :false-value="0" v-model="temp.is_enabled">
                <label class="form-check-label" for="is_enabled">是否啟用 </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="closeModal('closeProductModal')">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click="createOrEditData(temp)">
          確認
        </button>
      </div>
    </div>
  </div>
    `
})

app.component('page',{
    data(){
        return{

        }
    },
    props: ['paginationData'],
    methods:{
        getPage(item){
            this.$emit('get',item)
        }
    },
    template: 
    `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
        <li class="page-item" :class="{disabled: !paginationData['has_pre']}"  @click="getPage(paginationData['current_page']-1)">
            <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li  class="page-item" v-for="item in paginationData['total_pages']"  @click="getPage(item)"> 
            <a class="page-link" href="#">
            {{item}}
            </a>
        </li>
        <li class="page-item" :class="{disabled: !paginationData['has_next']}" >
            <a class="page-link" href="#" aria-label="Next" @click="getPage(paginationData['current_page']+1)">
            <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
        </ul>
    </nav>
    `
})
app.mount('#app')
