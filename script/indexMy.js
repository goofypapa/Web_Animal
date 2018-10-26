var docuWidth = document.documentElement.clientWidth;
var docuHeight = document.documentElement.clientHeight;
//js获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
// 批次随机
var allOwnerId=["b50f11e6bddbe784523d7571e05bd41a","c7eb11e6bf1701d2cf56e9cd8d9bd25a","e1f811e68d9bbf6a4aa799bdde2479b0","fa4211e6ab8ea59afa157f6173462122","c99811e7b302bd97e4475a5f9f7f95bc","c99811e7b302bd97e4475a5fa49a0add"];
var random = Math.floor(Math.random() * 6);
var myownerId = allOwnerId[random];
console.log(myownerId);
// 动物ID数组
$.ajax({
    type: "post",
    url: "http://www.dadpat.com/api/res/list/summary.do",
    dataType: "jsonp",
    data: { "ownerId": myownerId }, //以键/值对的形式
    async: true,
    success: function (data) {
        var dataAnimal=data.data;
        var animalId=[];
        for(var i=0;i<dataAnimal.length;i++){
            animalId.push(dataAnimal[i].resourceId);
        }
        Array.prototype.shuffle = function() {
            var input = this;
            for (var i = input.length-1; i >=0; i--) {
                var randomIndex = Math.floor(Math.random()*(i+1));
                var itemAtIndex = input[randomIndex];
                input[randomIndex] = input[i];
                input[i] = itemAtIndex;
            }
            console.log(input) ;
        };
        animalId.shuffle();
        // var allId=[];
        for(var i=0;i<animalId.length;i++){
            $.ajax({
                type: "post",
                url: "http://www.dadpat.com/api/res/get.do",
                dataType: "jsonp",
                data: { "resId": animalId[i] }, //以键/值对的形式
                async: true,
                success: function (data) {
                    var indexAnimal = data.data;
                    var sourceWidth = 1080;
                    var sourceHeight = 1920;
                    // 随机一个声音
                    var audioRandom=Math.floor(Math.random()*(indexAnimal.audio.length));
                    console.log(audioRandom);
                    // allId.push(indexAnimal.resourceId);
                    $('body').css({
                        'height': docuHeight,
                        'width': docuWidth,
                        'background-color': '#272E38',
                        'overflow': 'hidden'
                    });
                    $('#wrapper').append('<div class="swiper-slide"><div class="animal" style="background: -webkit-linear-gradient(left top,' +
                        indexAnimal.colorBegin + ',' + indexAnimal.colorEnd + ')"id="a1"><a href="details.html?resourceId=' + indexAnimal.resourceId +
                        '"><img data-src="http://www.dadpat.com/' + indexAnimal.image.cover.attUrl +
                        '" class="swiper-lazy" alt=""/><div class="swiper-lazy-preloader"></div></a><div class="voice"><audio name="'+indexAnimal.resourceId+'" src="http://www.dadpat.com/'+indexAnimal.audio[audioRandom].attUrl +'" ></audio><img  src="image/voiced.png" class="swiperes" alt=""/><a onclick="opendetails(' +
                        indexAnimal.resourceId + ')">' + indexAnimal.resourceTitle + '</a></div><p class="animalInfo">'+indexAnimal.simpleDesc+'</p></div></div>');
                    $('.animal').css({
                        'width': Math.floor(0.73 * docuWidth),
                        'height': Math.floor(0.74 * docuHeight),
                        'margin': '0 auto',
                        'border-radius': '0.3rem',
                        'position': 'relative',
                        'margin-top': '3.5rem'
                    });
                    $('.animal a img').css({
                        'position': 'absolute',
                        'max-width': Math.floor(874 / sourceWidth * docuWidth),
                        'max-height': Math.floor(760 / sourceHeight * docuHeight),
                        'display': 'block',
                        'left': Math.floor(-0.1 * 1* docuWidth),
                        'top': Math.floor(0.08 * 0.5 * docuHeight),
                        'cursor': 'pointer',
                        'padding-bottom': '8rem'
                    });
                    $('.animal .voice').css({
                        'position': 'absolute',
                        'right': Math.floor(0.04 * 0.73 * docuWidth),
                        // 'top': Math.floor(0.61 * 0.74 * docuHeight)
                        'bottom':'4.6rem'
                    });
                    window.onload=function(){
                        var allAudio=$(".voice audio");
                        console.log(allAudio);
                        // console.log(allId);
                        // allAudio[0].play();
                        // window.android.initMusic(allAudio[0].src);
                        // window.android.startMusic();
                        if( typeof( goofypapaGame ) != "undefined" && goofypapaGame ){
                            window.location.href = "goofypapa://playAudio," + allAudio[0].src;
                        }else if( typeof( window.android ) != "undefined" ) {
                            window.android.initMusic(allAudio[0].src);
                            window.android.startMusic();
                        }else{
                            console.log(allAudio[0].src);
                        }
                        var swiper = new Swiper('.swiper-container', {
                            loop:true,
                            lazy: {
                                loadPrevNext: true  //设置为true允许将延迟加载应用到最接近的slide的图片（前一个和后一个slide）
                            },
                            on:{
                                slideChangeTransitionEnd:function(){
                                    var randomA=Math.floor(Math.random()*(indexAnimal.audio.length));
                                    console.log(randomA);
                                    console.log(allAudio[this.realIndex]);
                                    var randomAnimalId=allAudio[this.realIndex].getAttribute("name") ;
                                    console.log(randomAnimalId);
                                    $.ajax({
                                        type: "post",
                                        url: "http://www.dadpat.com/api/res/get.do",
                                        dataType: "jsonp",
                                        data: { "resId": randomAnimalId }, //以键/值对的形式
                                        async: true,
                                        success: function (data) {
                                            console.log(data.data);
                                            console.log(randomA);
                                            if(swiper.realIndex!=0){
                                                allAudio[swiper.realIndex].src="http://www.dadpat.com/"+data.data.audio[randomA].attUrl +"";
                                            }
                                            if(swiper.realIndex==0){
                                                // allAudio[0].play();

                                                allAudio[swiper.realIndex+1].pause();
                                                allAudio[swiper.realIndex+1].currentTime = 0;
                                            }else if(swiper.realIndex==11){
                                                allAudio[swiper.realIndex].play();
                                                // window.android.initMusic(allAudio[swiper.realIndex].src);
                                                // window.android.startMusic();
                                                allAudio[swiper.realIndex-1].pause();
                                                allAudio[swiper.realIndex-1].currentTime = 0;
                                            }
                                            else{
                                                allAudio[swiper.realIndex].play();
                                                // window.android.initMusic(allAudio[swiper.realIndex].src);
                                                // window.android.startMusic();
                                                allAudio[swiper.realIndex+1].pause();
                                                allAudio[swiper.realIndex+1].currentTime = 0;
                                                allAudio[swiper.realIndex-1].pause();
                                                allAudio[swiper.realIndex-1].currentTime = 0;
                                            }
                                        }
                                    });
                                    // allAudio[this.realIndex].src="http://www.dadpat.com/"+indexAnimal.audio[randomA].attUrl +"";



                                }
                            }
                        });
                        $(".voice>img").click(function(){
                            console.log($(this).prev())
                            if($(this).prev()[0].paused){
                                $(this).prev()[0].play();
                                $(this).attr('src', 'image/gif.gif');
                                var audio=$(this).prev()[0];
                                console.log(audio);
                                audio.addEventListener('ended', function () {
                                    console.log(this);
                                    $(this).next("img").attr('src', 'image/voiced.png');
                                }, false);
                            }else{
                                $(this).prev()[0].pause();
                                $(this).prev()[0].currentTime=0;
                                $(this).attr('src', 'image/voiced.png');
                            }
                        })
                    }
                }
            })
        }
    }

});

//调用Android退出app
$('.back').click(function () {
    if( typeof( goofypapaGame ) != "undefined" && goofypapaGame ){
        window.location.href='goofypapa://back';
    }else{
        window.android.exitApp()
    }
});


