function LoadPage(PageName)
{
    $.ajax({
        method:'get',
        url:PageName,
        success:(response)=>{
            $("section").html(response);
        }
    })
}

$(()=>{
    $(document).on("click","#adminsignin",()=>{
        LoadPage('admin-login.html');
    })

    function LoadVideos(){
        $("section").html("");
        $.ajax({
            method:'get',
            url:'http://127.0.0.1:3300/getvideos',
            success:(videos)=>{
                videos.map(video=>{
                    $("tbody").append(`
                    <tr>
                        <td>${video.Title}</td>
                        <td><iframe src=${video.Url} width="200" heighr="100"></iframe></td>
                        <td>
                            <button id="btnEdit" name=${video.VideoId} class="btn btn-warning bi bi-pen-fill"></button>
                        </td>
                        <td>
                            <button id="btnDelete" name=${video.VideoId} class="btn btn-danger bi bi-trash-fill"></button>
                        </td>
                    </tr>
                    `)
                })
            }
        })
    }

    $(document).on("click","#btnAdminLogin",()=>{
        $.ajax({
            method:'get',
            url:'http://127.0.0.1:3300/getadmin',
            success:(response)=>{
                var admin=response.find(user=>user.UserId==$("#AdminUserId").val());
                console.log($("#AdminPassword").val())
                if(admin.UserId==$("#AdminUserId").val() && admin.Password==$("#AdminPassword").val()){
                    document.cookie=`UserName=${admin.UserName}`;
                    LoadPage('admin-dashboard.html');
                    LoadVideos();
                    $("#signincontainer").html(`${ document.cookie.substring(document.cookie.indexOf("=")+1).toUpperCase()} <button class="btn btn-warning" id="signout">Signout</button>`)
                }
                else{
                    alert('Invalid Admin Details');
                }
            }
        })
    })

    function LoadCategories(){
        $.ajax({
            method:'get',
            url:'http://127.0.0.1:3300/getcategories',
            success:(response)=>{
                response.map(category=>{
                    $('select').append(`<option value=${category.CategoryId}>${category.CategoryName}</option>`)
                })
            }
        })
    }

    $(document).on("click","#btnAddNew",()=>{
        LoadPage('admin-addvideo.html');
        LoadCategories();
    })

    $(document).on("click","#btnAddVideo",()=>{
        var video={
            VideoId:$("#VideoId").val(),
            Title:$("#Title").val(),
            Url:$("#Url").val(),
            Likes:$("#Likes").val(),
            Views:$("#Views").val(),
            CategoryId:$("#lstCategories").val()
        };
        $.ajax({
            method:'post',
            url:'http://127.0.0.1:3300/addvideo',
            data:video
        })
        alert('Video Added Successfully');
        LoadPage('admin-dashboard.html');
        LoadVideos();
    })

    var id;
    $(document).on("click","#btnEdit",(e)=>{
        LoadPage('admin-editvideo.html');
        LoadCategories();
        id=parseInt(e.target.name);
        $.ajax({
            method:'get',
            url:`http://127.0.0.1:3300/getvideo/${id}`,
            success:(video=>{
            $("#VideoId").val(video[0].VideoId),
            $("#Title").val(video[0].Title),
            $("#Url").val(video[0].Url),
            $("#Likes").val(video[0].Likes),
            $("#Views").val(video[0].Views),
            $("#lstCategories").val(video[0].CategoryId)
            })
        })
    })

    $(document).on("click","#btnCancel",()=>{
        LoadPage('admin-dashboard.html');
        LoadVideos();
    })

    $(document).on("click","#btnUpdateVideo",()=>{
        var update={
            VideoId:$("#VideoId").val(),
            Title:$("#Title").val(),
            Url:$("#Url").val(),
            Likes:$("#Likes").val(),
            Views:$("#Views").val(),
            CategoryId:$("#lstCategories").val()
        };
        $.ajax({
            method:'put',
            url:`http://127.0.0.1:3300/updatevideo/${id}`,
            data:update
        })
        alert('Video Updated...');
        LoadPage('admin-dashboard.html');
        LoadVideos();
    })

    $(document).on("click","#btnDelete",(e)=>{
        var id=parseInt(e.target.name);
        var flag=confirm("Are You Sure ?\nWant To Delete? ");
        if(flag==true){
            $.ajax({
                method:'delete',
                url:`http://127.0.0.1:3300/deletevideo/${id}`,
            })
            alert('Video Deleted Successfully..');
            LoadPage('admin-dashboard.html');
            LoadVideos();
        }
    })

    $(document).on("click","#signout",()=>{
        $("#signincontainer").html(`<span class="bi bi-person-fill"> <a id="adminsignin">Signin</a></span>`);
        LoadPage('admin-login.html');
    })
})