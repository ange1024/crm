// 对ajax进行二次封装

axios.defaults.baseURL = 'http://127.0.0.1:8888';

axios.defaults.withCredentials = true; //配置true，请求后台自动带上cookie

// 数据以表单的形式传递
axios.defaults.headers['Content-Type']='application/x-www-form-urlencoded';
// 更改表单传输数据格式
axios.defaults.transformRequest = function(data){
    if(!data) return data;
    let result ='';
    for(let attr in data){
        if(!data.hasOwnProperty(attr)) break;
        result += `&${attr}=${data[attr]}`;
    }
    return result.substring(1);
}
// 请求拦截器
axios.interceptors.request.use(config =>{
    return config
})
// 响应拦截器
axios.interceptors.response.use(response =>{
    return response.data
},reason=>{
    // console.dir(reason); 
    switch(String(reason.response.status)){
        case '404':
            alert('当前请求的地址不存在！')
            break;
        default:
            break;
    }
    return Promise.reject(reason)
})


