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
  return currentDate;
}

console.log(getBeijingtime().getMinutes())