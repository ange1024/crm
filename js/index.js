$(function(){
    init()
    //订阅
    let $plan = $.Callbacks()

    let $navBoxList = $('.navBox>a')
    let $itemBoxList = null

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
    //实现组织结构和客户管理点击切换
    function handGroup(index){
        let $group1 = $itemBoxList.filter((_,item)=>{
            let text = $(item).attr('text');
            return text === '客户管理'
        })
        let $group2 = $itemBoxList.filter((_,item)=>{
            let text = $(item).attr('text');
            return /^(员工管理|部门管理|职位管理)/.test(text)
        })
        //控制哪一组显示
        if(index === 0){
            $group1.css('display','block');
            $group2.css('display','none');
        }else if(index===1){
            $group1.css('display','none');
            $group2.css('display','block')
        }
    }

    //实现tab选项卡
    $plan.add((power)=>{
        // console.log('渲染菜单',power); 
        let str = '';
        if(power.includes('userhandle')){
            str +=`
            <div class="itemBox" text="员工管理">
				<h3>
					<i class="iconfont icon-yuangong">员工管理</i>
				</h3>
				<nav class="item">
					<a href="page/userlist.html" target="iframeBox">员工列表</a>
					<a href="page/useradd.html" target="iframeBox"> 新增员工</a>
				</nav>
			</div>
            `
        }
        if(power.includes('departhandle')){
            str +=`
            <div class="itemBox" text="部门管理">
				<h3>
					<i class="iconfont icon-zhiwu">部门管理</i>
				</h3>
				<nav class="item">
					<a href="page/departmentlist.html" target="iframeBox">部门列表</a>
					<a href="page/departmentadd.html" target="iframeBox"> 新增部门</a>
				</nav>
			</div>
            `
        }
        if(power.includes('jobhandle')){
            str +=`
            <div class="itemBox" text="职位管理">
				<h3>
					<i class="iconfont icon-zhiwuguanli">职位管理</i>
				</h3>
				<nav class="item">
					<a href="page/joblist.html" target="iframeBox">职位列表</a>
					<a href="page/jobadd.html" target="iframeBox"> 新增职位</a>
				</nav>
			</div>
            `
        }
        if(power.includes('customerall')){
            str +=`
            <div class="itemBox" text="客户管理">
				<h3>
					<i class="iconfont icon-yonghuming">客户管理</i>
				</h3>
				<nav class="item">
					<a href="page/customerlist.html" target="iframeBox">我的客户</a>
					<a href="page/customerlist.html" target="iframeBox">全部客户</a>
					<a href="page/customeradd.html" target="iframeBox"> 新增客户</a>
				</nav>
			</div>
            `
        }
        $('.menuBox').html(str)

        $itemBoxList = $('.menuBox').find('.itemBox');




    })

    $plan.add(power=>{
        //控制默认显示哪一个
        let initIndex = power.includes('customer')? 0:1;
        $navBoxList.eq(initIndex).addClass('active').siblings().removeClass('active')
        handGroup(initIndex)
        // 点击切换
        $navBoxList.click(function(){
            let index = $(this).index();
            
           
            let text = $(this).html().trim();
            if((text === '客户管理')&& !/customerall/.test(power)||(text === '组织结构')&& !/(userhandle|departhandle|jobhandle)/.test(power)){
                alert('没有权限访问')
            }
            if(index === initIndex) return;
            $(this).addClass('active').siblings().removeClass('active')
             handGroup(index)
             initIndex =index;
        })
    })
    // 控制默认的iframe的src
    $plan.add(power=>{
        let url = 'page/customerlist.html'
        if(power.includes('customerall')){
            $('.iframeBox').attr('src',url)
        }
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
        power.code === 0? power=power.power:null;
        baseInfo.code===0 ? baseInfo=baseInfo.data:null;
        // 发布
        $plan.fire(power,baseInfo)
    }
})