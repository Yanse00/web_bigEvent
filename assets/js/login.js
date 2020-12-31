$(function() {
    // 点击去注册账号的连接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show();
    });

    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide();
    });

    // 从layui上获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            // 通过形参拿到的是确认密码框的值
            // 2.还要拿到密码框的值
            // 3.进行一次等于的判断
            // 4.如果判断失败,就return一个消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        },
    });

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }
        $.post('http://ajax.frontend.itheima.net/api/reguser', data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录', { time: 2000 }, function() {
                    $('#link_login').click();
                })

            })
    })


    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: 'http://ajax.frontend.itheima.net/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                    // 将登陆成功得到的token字符串保存到本地缓存
                localStorage.setItem('token', res.token)
                console.log(res.token);
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})