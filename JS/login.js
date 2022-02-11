const app = {
    data(){
        return{
            user:{
                username: '',
                password: '',
            },
            url: 'https://vue3-course-api.hexschool.io/v2',
            path: 'immigrant524',

        }
    },
    methods:{
        getData(){
            axios.post(`${this.url}/admin/signin`,this.user)
            .then(res=>{  
                let {token , expired} = res.data;
                document.cookie = `hexToken=${token}; expires=${new Date(expired)}; `;
                window.location='index.html';
            })
            .catch(err=>{
                console.dir(err);
                alert(err.data.message);
            })
        },
        checkLogin(){
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(`${this.url}/api/user/check`)
                .then(res=>{
                    // console.log(res);
                })
                .catch(err=>{
                    // console.log(err);
                })
        }
    },
    mounted() {
        
    },
};
Vue.createApp(app).mount('#app');
