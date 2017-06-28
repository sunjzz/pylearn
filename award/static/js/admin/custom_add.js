/**
 * Created by liudianbing on 2017/3/8.
 * 这个js用来定义常规的添加行为
 */
(function ($) {  //闭包jquery，避免和mootools冲突
    $("#Item_add_sysId").change(function (e) {
        var cardId = $(this).val();
        if (cardId != null) {
            $.getJSON("/admin/sc-syssetting-online?cardId=" + cardId, {}, function (result) {
                if (result.error == false && result.cardInfo != null) {
                    var obj = $("#Item_add_title");
                    if (obj.val() == "") {
                        obj.val(result.cardInfo.sysCardShortName);
                    }
                    obj = $("#Item_add_info");
                    if (obj.val() == "") {
                        obj.val(result.cardInfo.sysCardName);
                    }
                }
            })
        }
    })
    $(document).ready(function () {

        if ($("#wwctrl_Item_add_source").length > 0) {
            var itemId = 0;
            if ($("#Item_edit_id").length > 0) {
                itemId = $("#Item_edit_id").val();
            }

            $.getJSON("/admin/channel/get-all-channel", {itemId: itemId}, function (result) {
                if (result.error == false && result.data != null) {
                    var html = "<input type=\"checkbox\" name=\"item_channel_mapping_checkAll\" value=\"\" id=\"item_channel_mapping_checkAll\" onclick='item_channel_mapping_checkAllFuc'><span for=\"item_channel_mapping_checkAll\" style='color:darkred' class=\"wwlbl\">全选</span>";
                    for (var i = 0; i < result.data.length; i++) {
                        var item = result.data[i];
                        html += '<span class="wwlbl" style="padding-right: 20px"><input type="checkbox" name="item_channel_mapping" value="' + item.channelId + '"';
                        if (item.itemId > 0) {
                            html += ' checked="checked"';
                        }
                        html += ' id="item_channel_mapping_' + item.channelId + '"	/><span for="item_channel_mapping_' + item.channelId + '" class="wwlbl">' + item.channelName + '(' + item.channelCode + ')' + '</span></span>';
                    }
                    $("#wwctrl_Item_add_source").html(html);

                    $("#item_channel_mapping_checkAll").click(function () {
                        var allItemChecked = $(this)[0].checked;
                        $("input:checkbox[name='item_channel_mapping']").each(function () {
                            $(this)[0].checked = allItemChecked;
                        });
                    });
                }
            });
        }
    });

})(jQuery);
