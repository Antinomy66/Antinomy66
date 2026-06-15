const text = " 数据科学 | 可视化 | 编程苦手 ";

let i = 0;

function typing(){

    if(i < text.length){

        document.getElementById("typing").innerHTML += text.charAt(i);

        i++;

        setTimeout(typing,80);

    }

}

typing();