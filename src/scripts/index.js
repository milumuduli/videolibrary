function LoadPage(PageName){
    $.ajax({
        method:'get',
        url:PageName,
        success:(pages)=>{
            $("section").html(pages);
        }
    })
}


$(function(){
    $("#passwordContainer").hide();

    
    $(document).on("click","#signin",()=>{
        LoadPage('user-login.html');
    });

    $("#brand-name").click(()=>{
        this.location.reload();
    })

    $("#home").click(()=>{
        this.location.reload();
    })

    $("#videos").click(()=>{
        LoadPage('user-login.html');
    })

    $("#about").click(()=>{
        this.location.reload();
    })

    $("#contact").click(()=>{
        this.location.reload();
    })

    $(document).on("click","#join",()=>{
        LoadPage('user-login.html');
    })
    var email="";
    $(document).on("click","#btnGetStarted",()=>{
        email=$("#Email").val();
        $.ajax({
            method:'get',
            url:'http://127.0.0.1:3300/getusers',
            success:(users)=>{
                var user=users.find(item=> item.Email===email);
                if(user){
                    if(user.Email===email){
                        $("#passwordContainer").show();
                        $("#emailContainer").hide();
                        $("#error").hide();
                    }
                }
                else{
                    $("#error").html(`<div class="mt-4">User Doesn't Exist - <button class="btn btn-light" id="lnkRegister">Register</button> </div>`);
                }
            }
        })
    })

    $("#btnSignIn").click(()=>{
        $.ajax({
            get:'get',
            url:'http://127.0.0.1:3300/getusers',
            success:(users)=>{
                var user=users.find(item =>item.Email===email);
                if(user){
                    if(user.Password===$("#Password").val()){
                        alert("Login Success");
                        $("#passwordContainer").hide();
                        document.cookie=`UserName=${user.UserName}`;
                        $("#signin").html(`${ document.cookie.substring(document.cookie.indexOf("=")+1).toUpperCase()} <button id="btnSignout" class="btn btn-warning">Signout</button>`)
                        LoadVideos();
                    }
                    else{
                        alert("Invalid Password");
                    }
                }
            }
        })
    })
 
    $(document).on("click","#lnkRegister",()=>{
        LoadPage('user-register.html');
        $("error").hide();
    })


    $(document).on("click","#btnRegister",()=>{
        var user={
            "UserId":$("#UserId").val(),
            "UserName":$("#UserName").val(),
            "Password":$("#RPassword").val(),
            "Email":$("#REmail").val(),
            "Mobile":$("#Mobile").val()
        }
        $.ajax({
            method:'post',
            url:'http://127.0.0.1:3300/adduser',
            data:user
        })
        alert('Registered Successfully..');
        LoadPage('user-login.html');
    })

    function LoadVideos(){
        $("section").html('');
        $.ajax({
            method:'get',
            url:'http://127.0.0.1:3300/getvideos',
            success:(videos)=>{
                videos.map(video=>{
                    $(`
                        <div class="box">
                            <iframe height="200" src=${video.Url} class="card-img-top"></iframe>
                            <div>
                                <span class="bi bi-hand-thumbs-up-fill me-4">${video.Likes}</span><span class="bi bi-eye-fill">${video.Views} Views</span>
                            </div>
                            <div>
                                ${video.Title}
                            </div>
                        </div>
                    `).appendTo("section");
                })
            }
        })
    }

    $(document).on("click","#btnLogin",()=>{
        $.ajax({
            method:"get",
            url:'http://127.0.0.1:3300/getusers',
            success:(users)=>{
                var user=users.find(item => item.UserId==$("#LoginUserId").val());
                if(user.UserId==$("#LoginUserId").val() && user.Password==$("#LoginPassword").val()){                  
                    document.cookie=`UserName=${user.UserName}`;
                    LoadVideos();
                    $("#signin").html(`${ document.cookie.substring(document.cookie.indexOf("=")+1).toUpperCase()} <button id="btnSignout" class="btn btn-warning">Signout</button>`)
                }
                else{
                    alert(`Invalid UserName or Password`);
                }
            }
        })
    })

    $(document).on("click","#btnSignout",()=>{
        // this.location.reload();
        $("#signin").html(`<span> <a id="signin">Signin</a></span>`);
        LoadPage('user-login.html')
    })
})
