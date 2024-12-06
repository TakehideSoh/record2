

function flickStart(event){
    event.preventDefault();
	startX = event.touches[0].pageX;
} 
function flicking(event){
    event.preventDefault();
	endX = event.touches[0].pageX;
}
function flickEnd(event){
    if( (endX - startX) < 0 ) {//左スワイプ
        
        event.classList.add("leftswipe");

    } else {//右スワイプ
        event.classList.remove("leftswipe");
 
    }
}
