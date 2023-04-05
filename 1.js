const axios = require("axios");

//客户端时间转换为北京时间
 function getBeijingtime() {
    //获得当前运行环境时间
    let d = new Date();
    let currentDate = new Date();
    let tmpHours = currentDate.getHours();
    //算得时区
    let time_zone = -d.getTimezoneOffset() / 60;
    if (time_zone < 0) {
        time_zone = Math.abs(time_zone) + 8; currentDate.setHours(tmpHours + time_zone);
    } else {
        time_zone -= 8; currentDate.setHours(tmpHours - time_zone);
    }
    const date = currentDate
    return date.getFullYear() + '年' + (date.getMonth() + 1).toString().padStart(2, '0') + '月' + date.getDate().toString().padStart(2, '0') + '日' + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0')
}

module.exports = async function () {
  const FEISHU_ROBOT_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/3d84afd6-c03e-453d-aca6-cf5d551ed207'; // 飞书机器人链接
  const time = getBeijingtime()

  const params = {
    "ref": "refs/heads/main",
    "repository": {
      "name": "chengfeng-blog",
      "html_url": "https://github.com/rideWind97/chengfeng-blog"
    },
    "pusher": {
      "name": "rideWind97",
      "email": "47934820+rideWind97@users.noreply.github.com"
    },
    "commits": [
      {
        "message": "fix: 测试1",
        "modified": [
          1
        ]
      }
    ],
    "head_commit": {
      "message": "fix: 测试1",
      "modified": [
        "1.js"
      ]
    }
  }

  const { ref, repository, pusher, commits, head_commit } = params;
  const workflow = ref.split('/')[2]
  const mode = ['main', 'master'].includes(workflow) ? '生产环境' : ['dev', 'develop'].includes(workflow) ? '测试环境' : '其它环境'
  const project = repository.name
  const commitInfoArr = commits.map((item, i) => [{ tag: "text", text: `${i+1}、${item.message}` }, { tag: "text", text: `\n` }, { tag: "text", text: `修改文件：${item.modified}` }])

  const msg = {
    msg_type: "post",
    content: {
      post: {
        zh_cn: {
          title: "TIP：push code",
          content: [
            [{ tag: "text", text: `项目：【${project}】有新的push` }],
            [{ tag: "text", text: `环境：${mode}` }],
            [{ tag: "text", text: `最新版本信息：${head_commit.message}` }],
            [{ tag: "text", text: `\n` }],
            [{ tag: "text", text: `本次提交总共有${commits.length}个` }],
            ...commitInfoArr,
            [{ tag: "text", text: `\n` }],
            [{ tag: "text", text: `提交时间：${time}` }],
            [{ tag: "text", text: `提交人：${pusher.name}` }],
            [{ tag: "text", text: `\n` }],
            [{ tag: "a", text: `点击直达git仓库地址`, href: `${repository.html_url}` }],
            [
              {
                tag: "a",
                text: `点击查看代码变更`,
                href: `${head_commit.url}`
              }
            ],
            [{ tag: "at", text: '所有人' }]
          ]
        },
      },
    },
    
  };
  
  if (FEISHU_ROBOT_URL) {
    axios({
        url: FEISHU_ROBOT_URL,
        method: 'post',
        data: msg
    }).then(res => {
      console.log('res', res)
    }).catch(err => {
      console.log('Error: ', err.message);
  })
  }
};

