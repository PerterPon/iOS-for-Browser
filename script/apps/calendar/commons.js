$(document).ready(function() {
    var containerList;
    var containerNote = $(".x-container-list");

    success();
    // $.ajax({
    //     url: "../../datas/Calendar.json",
    //     dataType: 'text',
    //     success: function(data) {
    //         var dataList = eval('(' + data + ')');

    //         $.Calendar($(".x-content .x-container"), function(selectedDate) {
    //             if (!containerList) {
    //                 containerList = $.list({ //todo 修改成创建实例，增加刷新删除功能
    //                     container: containerNote,
    //                     data: dataList[selectedDate],
    //                     itemTpl: '<div class="noteTime"><strong>{$time}</strong></div><span class="name">{$type}<br><span class="tertiary">{$des}</span></span>'
    //                 });
    //             }
    //             else {
    //                 if (containerList.replace) {
    //                     containerList.replace(dataList[selectedDate]);
    //                 }
    //             }
    //         }, dataList);
    //         //to do 样式加载完成后设置数据

    //         containerNote.css("height", $(".x-content").height() - $(".x-container").height());
    //     },
    //     error: function(res) {
    //         alert("数据获取失败");
    //     }
    // });
    function success() {
        var dataList = window.Calendar;
        $.Calendar($(".x-content .x-container"), function(selectedDate) {
            if (!containerList) {
                containerList = $.list({ //todo 修改成创建实例，增加刷新删除功能
                    container: containerNote,
                    data: dataList[selectedDate],
                    itemTpl: '<div class="noteTime"><strong>{$time}</strong></div><span class="name">{$type}<br><span class="tertiary">{$des}</span></span>'
                });
            }
            else {
                if (containerList.replace) {
                    containerList.replace(dataList[selectedDate]);
                }
            }
        }, dataList);
        //to do 样式加载完成后设置数据

        containerNote.css("height", $(".x-content").height() - $(".x-container").height());
    }

    $(window).resize(function() {
        containerNote.css("height", $(".x-content").height() - $(".x-container").height());
    });
});