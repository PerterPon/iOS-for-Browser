window.conf = {
    "rootURL" : "http://192.168.0.21:9090/",
    "timeout" : 5000,
    "debugging" : true,
    "landscape" : "left",
    "ready": null,
    "exit": function(){
        if (confirm("是否要退出？")){
            window.location.replace("../index.html");
        }
    }
}