$(document).ready(function() {
    function updateLeaderboard() {
        var url = $("#leaderboard-table").data("url");
        $.ajax({
            url: url,
            type: "GET",
            success: function(data) {
                $(".custom-table tbody").html(data.html);
            },
            error: function(xhr, status, error) {
                console.error("Error updating leaderboard:", error);
            }
        });
    }

    // 
    setInterval(updateLeaderboard, 500); 
});
