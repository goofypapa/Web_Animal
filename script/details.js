//   6图片轮播js

//调用ajax代码
//js获取url参数
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
//定义变量接收url参数
var myresourceId=GetQueryString("resourceId");
var imgType =GetQueryString("imgType");
// 测试数据
var myresourceId="8e0111e7b93b3f959a25b9e1eca1af99";
$.ajax({
    type:"post",
    url:"http://www.dadpat.com/api/res/get.do",
    dataType:"jsonp",
    data:{"resId":myresourceId}, //以键/值对的形式
    // data:{"resId":'8e4011e7b93b3f959a25b9e19140706f'}, //以键/值对的形式
    async:true,
    success:function(data){
        //设置动物轮播图片
        var datas=data.data;
        console.log(data);
        if(datas.image.banners.length>0){
            for(var i=0;i<3;i++){        
                $("#header .swiper-wrapper").append('<div class="swiper-slide"><img style="width: 100%;" src="http://www.dadpat.com/'+datas.image.banners[i].attUrl+'" alt=""/></div>' );
            }  
        }
        var mySwiper = new Swiper('#header', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },//可选选项，自动滑动
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction',
            },
            // observer:true,//修改swiper自己或子元素时，自动初始化swiper
            // observeParents:true,//修改swiper的父元素时，自动初始化swiper
        });
        
        //获取动物名称
        var resourceTitle=datas.resourceTitle;
        //设置页面头部动物名称
        $("header p").html(resourceTitle);
        //设置百科图标后动物名称
        $(".tabs>p>b").html(resourceTitle);
        //设置动物的描述资料
        var resourceDesc=datas.resourceDesc;
        $("article>p").html(resourceDesc);
        

        // 设置动物百科内容
        $("#Allbaike").attr("href",'baike.html?resourceId='+myresourceId);
            $("#Allbaike").click(function(){
                window.location.href="baike.html?resourceId="+myresourceId;
            });

        //获取动物声音总条数
        var audioCe=datas.audio;
        var audioAll = [];
        for(var i=0;i<audioCe.length;i++){
            if(audioCe[i].audioType == 'DEFAULT'){
                audioAll.push(audioCe[i])
            }
            //简介里的声音
            if(audioCe[i].audioType == 'PRON_CN'){
                var audioInput = document.createElement("input");
                audioInput.type="hidden";
                audioInput.value='http://www.dadpat.com/'+audioCe[i].attUrl;
                $("article>p").append(audioInput);
                // $(".audioEnglish").remove();
                // $('.audioEnglish').attr('src','http://www.dadpat.com/'+audioCe[i].attUrl)
            }
        }
        //点击简介里的声音
        $(".playEnglish").click(function(){
            // $(this).next("audio")[0].play();
            // console.log($(this).parent("p").children("input").val());
            var introductionAduio=$(this).parent("p").children("input").val();
            if( typeof( goofypapaGame ) != "undefined" && goofypapaGame ){
                goofypapaStopAllAndPlayAudio( introductionAduio, function(){
                } );
            }else if( typeof( window.android ) != "undefined" ) {
                window.android.initMusic(introductionAduio);
                window.android.startMusic();
            }else{
                console.log( introductionAduio);
            };
        });
        for(var i=0;i<3;i++){
            if(audioAll.length <= i) break;
            var myDuration=Number(audioAll[i].duration);  //音频时间
            myDuration=Math.round(myDuration/1000);
            console.log(myDuration);
            if(myDuration==0){
                myDuration=1
            }
            var myTime=myDuration>9?"0:"+myDuration:"0:0"+myDuration;
            if(datas.recordTime==null&&datas.recordPlace==null){
                $("#audio ul").append('<li style="width: 33%;float:left;border-right: 1px solid rgba(255,255,255,0.1);"><p style="margin-top: 0.6rem;">'+[i+1]+'</p><!--动物声音播放动画--><span style="margin-left: 0rem;">'+myTime+'</span><img style="float: left;" src="image/play.png" class="playAudio" alt=""/><input type="hidden" value="http://www.dadpat.com/'+datas.audio[i].attUrl+'"></li>')
            }else{
                $("#audio ul").append('<li><p>'+[i+1]+'</p><!--动物声音播放动画--><div class="info"><p><img src="image/time.png" alt=""/><span>'+datas.recordTime+'</span><img src="image/add.png" alt=""/><span>'+datas.recordPlace+'</span></p></div><span>'+myTime+'</span><img src="image/play.png" class="playAudio" alt=""/><input type="hidden" value="http://www.dadpat.com/'+datas.audio[i].attUrl+'"></li>')
            }
        }
        // 更改之后的声音播放js
        var count=0;
        var t1;
        $("#audio ul li>img").click(function(){
           var audioUrl=$(this).next("input").val();
           var audioTimeO=$(this).prev("span").text();
           var audioTime=audioTimeO.substr(2,2);
           audioTime=audioTime.indexOf("0")==0?audioTime.substr(1,1):audioTime;
           var imgIndex=$(this).parent("li").index();
           var activeImg=$("#audio ul li>img")[imgIndex];
           console.log(audioTimeO);
           console.log(audioTime);

            if(count==0){
                if( typeof( goofypapaGame ) != "undefined" && goofypapaGame  ){
                    goofypapaStopAllAndPlayAudio( audioUrl, function(){
                        $(activeImg).attr("src","image/play.png");
                        $(activeImg).prev("span").text(audioTimeO);
                    } );
                }else if( typeof( window.android ) != "undefined" ) {
                    window.android.initMusic(audioUrl);
                    window.android.startMusic();
                }else{
                    console.log( audioUrl);
                }
                t1=window.setInterval(function(){
                    if(audioTime!=0){
                        audioTime-=1;
                        $(activeImg).prev("span").text("0:0"+audioTime);
                    }else{
                        // $(activeImg).attr("src","image/play.png");
                        $(activeImg).prev("span").text(audioTimeO);
                    }
                },1000);
                $(this).attr("src","image/pause.png");
                console.log($(this).parent("li").siblings("li").children("img").attr("src"));
                $(this).parent("li").siblings("li").children("img").attr("src","image/play.png");
                count=1;
            }else {
                count=0;
                if( typeof( goofypapaGame ) != "undefined" && goofypapaGame ){
                    goofypapaStopAllAudio();
                }else if( typeof( window.android ) != "undefined" ) {
                    window.android.initMusic(audioUrl);
                    window.android.stoptMusic();
                }else{
                    console.log( "停止播放"+audioUrl );
                }
                $(this).attr("src","image/play.png");
                clearInterval(t1);
            }

        });



        //声音的点击播放、暂停
        // var playAudio = document.querySelectorAll('.playAudio');
        // var audioP = document.querySelectorAll('#audio audio');
        // for(var i=0;i<playAudio.length;i++){
        //     if(audioP[i].paused){
        //         playAudio[i].onclick=function(){
        //             var path = this.src;
        //             var filename;
        //             if(path.indexOf("/")>0) {
        //                 filename=path.substring(path.lastIndexOf("/")+1,path.length).slice(0,-4);
        //             } else {
        //                 filename=path;
        //             }
        //             if(filename=='play'){
        //                 for(var j=0;j<audioP.length;j++){
        //                     audioP[j].pause();
        //                     audioP[j].currentTime=0;
        //                     playAudio[j].src='image/play.png';
        //                 }
        //                 $(this)[0].src='image/pause.png';
        //                 var audioPlay = this.nextSibling;
        //                 audioPlay.play();
        //                 var times = Math.ceil($(audioPlay)[0].duration)+'000';
        //                 var thisS = this;
        //                 setTimeout(function () {
        //                     $(thisS)[0].src='image/play.png';
        //                 },times);
        //             }else if(filename=='pause'){
        //                 for(var j=0;j<audioP.length;j++){
        //                     audioP[j].pause();
        //                     audioP[j].currentTime=0;
        //                     playAudio[j].src='image/play.png';
        //                 }
        //             }
        //         };
        //     }
        // }

        //简笔画模板
        $('.handDrawModel').append('<img src="http://www.dadpat.com/'+datas.image.handDraw.attUrl+'">')

        console.log()
        //设置动物的图片
        for(var i=0;i<6;i++){
            $(".container").append('<div class="item"><a href="javascript:;"><img src="http://www.dadpat.com/resource/thumbnail/'+datas.image.defaults[i].attId+'.file" alt=""/></a></div>');
        }
        var num = 6;
        $(".item img").load(function() {
            num--;
            if (num > 0) {
                return;
            }
            console.log('load compeleted');
            $(".container").rowGrid({itemSelector: ".item", minMargin: 5, maxMargin: 10, firstItemClass: "first-item"});
        });

        var aBox = document.querySelectorAll('.container img');
        var divBox = document.querySelector('.backgroun');
        for(var j=0;j<aBox.length;j++){
            var kaiguan=1;
            aBox[j].onclick=function() {
                var src = this.src;
                if(kaiguan){
                    divBox.style.display='block';
                    kaiguan=0
                    var that = this;
                    $('.backgroun').append('<img src='+src+' class="ImgBoy">');
                    setTimeout(function () {
                        $(".backgroun").empty('<img src='+src+' class="ImgBoy">');
                        divBox.style.display='none';
                        kaiguan =1
                    },2000)
                }
            }
        }

        //设置更多图片
        $("#Allpics").click(function(){
            window.location.href="pics.html?resourceId="+myresourceId+"&imgType=defaults";
        });
    },
    error:function(XMLResponse){
        alert(XMLResponse.responseText);
    }
});


//吃与被吃
//动态获取吃与被吃的图片
$.ajax({
    type:"post",
    url:"http://www.dadpat.com/foodChain/get.do",
    dataType:"jsonp",
    data:{"resId":myresourceId}, //以键/值对的形式
    async:true,
    success:function (data) {
        var datas=data.data;
        console.log(datas.descImg);
        $(".eaten").append('<img src=http://www.dadpat.com/'+datas.descImg+' style="width:100%">');
        $(".eaten").click(function () {
            // window.location.href="chain.html?resourceId=4a8511e8a69d112b84fd30494ea5baf6"
            window.location.href="chain.html?resourceId="+myresourceId
        })
    }
});
// 统计接口
$.ajax({
    type:"post",
    url:"http://www.dadpat.com/statistics/add.do",
    dataType:"jsonp",
    data:{"targetName":"BizRes","targetId":myresourceId}, //以键/值对的形式
    async:true,
    success:function (data) {}
});

//图片上传预览功能
//   function setImagePreviews(avalue) {
//         var docObj = document.getElementById("doc");
//         var dd = document.getElementById("dd");
//         dd.innerHTML = "";
//         var fileList = docObj.files;
//         if(fileList){
//         	 $(".handDrawDiv").css("background","url()");
//         }
//         console.log(fileList.length)
//         console.log(fileList)
      
//         if(fileList.length==0){
//         	$(".handDrawDiv").css("background","url(image/dadpat.png)");
//         	$(".handDrawDiv").css("background-size","cover");
//             console.log(555)
//         }else if(fileList.length==1){
//             dd.innerHTML += "<div style='float:left;height:5rem;width:5rem' > <img id='img'/> </div>";
//             var imgObjPreview = document.getElementById("img");
//             console.log(docObj.files)
//             if(docObj.files){
//                 imgObjPreview.style.display = 'block';
//                 imgObjPreview.style.maxWidth = '100%';
//                 imgObjPreview.style.maxHeight = '100%';
//                 imgObjPreview.style.minWidth = '100%';
//                 imgObjPreview.style.minHeight = '100%';
// //              imgObjPreview.src = docObj.files[0].getAsDataURL();
//                 //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
//                 imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
//                 console.log(666)
//             }else{
//                 console.log(55998);
//                 //图片异常的捕捉，防止用户修改后缀来伪造图片
//                 try {
//                     localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
//                     localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
//                     console.log(localImagId)
//                 }
//                 catch (e) {
//                     alert("您上传的图片格式不正确，请重新选择!");
//                     return false;
//                 }
//                 imgObjPreview.style.display = 'none';
//                 document.selection.empty();
//             }
//         }else if(fileList.length>1){
//             console.log('只可以选取一张图片');
//             //for循环拿到的是多张图片
//             for (var i = 0; i < fileList.length; i++) {
//                 dd.innerHTML += "<div style='float:left;height:5rem;width:5rem' > <img id='img" + i + "'  /> </div>";
//                 var imgObjPreview = document.getElementById("img"+i);
//                 if (docObj.files && docObj.files[i]) {
//                     //火狐下，直接设img属性
//                     imgObjPreview.style.display = 'block';
//                     imgObjPreview.style.maxWidth = '100%';
//                     imgObjPreview.style.maxHeight = '100%';
//                     imgObjPreview.style.minWidth = '100%';
//                     imgObjPreview.style.minHeight = '100%';
// //              imgObjPreview.src = docObj.files[0].getAsDataURL();
//                     //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
//                     imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]);
//                     console.log(imgObjPreview)
//                 }else {
//                     console.log(55998);
//                     //IE下，使用滤镜
//                     docObj.select();
//                     var imgSrc = document.selection.createRange().text;
//                     alert(imgSrc);
//                     var localImagId = document.getElementById("img" + i);
//                     //必须设置初始大小
//                     localImagId.style.maxWidth = '5rem';
//                     localImagId.style.maxHeight = '5rem';
//                     localImagId.style.minWidth = '5rem';
//                     localImagId.style.minHeight = '5rem';
//                     //图片异常的捕捉，防止用户修改后缀来伪造图片
//                     try {
//                         localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
//                         localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
//                         console.log(localImagId)
//                     }
//                     catch (e) {
//                         alert("您上传的图片格式不正确，请重新选择!");
//                         return false;
//                     }
//                     imgObjPreview.style.display = 'none';
//                     document.selection.empty();
//                 }
//             }
//         }

//         //上传后台只上传第一张
//         var formData = new FormData();
//       	formData.append('file',docObj.files[0]);
//           $.ajax({
//         	type:"POST",
//     		url:"http://www.dadpat.com/simpleDraw/saveSimple.do?animalId=" + myresourceId,
//     		data: formData, //以键/值对的形式
//     		cache: false,
// 			processData: false,
//             contentType: false,
//     		success:function(data){
//     			console.log(data) 	  	
//     		},
//     		error:function( XMLHttpRequest, textStatus, errorThrown ){
//     			console.log("--", textStatus);
//     			console.log("--", errorThrown);
//     		}
//         })
//         return true;
//     }

//清除localstorage记录
$("#goback").click(function(){
    localStorage.removeItem("name");
});
// 加载之后去除图片遮罩
window.onload=function () {
    $("#mask").fadeOut();
}
 



