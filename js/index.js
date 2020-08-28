$(function(){
    init()
    //订阅
    let $plan = $.Callbacks()

    $plan.add((_,baseInfo)=>{
        // console.log('渲染用户信息和实现退出登录',baseInfo);
        $('.baseBox>span').html(`你好，${baseInfo.name||''}`)

        $('.baseBox>a').click(async function(){
            let result = await axios.get('/user/signout')
            if(result.code == 0){
                window.location.href = 'login.html'
                return;
            }
            alert('网络不给力，请稍后再试')
        })
    })
    $plan.add((power)=>{
        // console.log('渲染菜单',power);        
    })

    async function init(){
        let result = await axios.get('/user/login')
        // console.log(result);
        if(result.code !==0){
            alert('请先登录')
            window.location.href='login.html'
            return;
        }
        //登录成功
        let [power,baseInfo] = await axios.all([
            axios.get('/user/power'),
            axios.get('/user/info')
        ])
        // console.log(power);
        // console.log(baseInfo);
        baseInfo.code===0 ? baseInfo=baseInfo.data:null;
        // 发布
        $plan.fire(power,baseInfo)
    }
})