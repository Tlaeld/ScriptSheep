/*
购物车锦鲤通用活动

第一个CK失效会退出脚本

助力显示可能会有误差，以活动界面成功邀请人数为准

活动有BUG，直接加购不用助力也行。

请求太频繁会被黑ip

变量：
//export jd_wxCartKoi_activityId="活动ID"
活动网址：
//https://lzkjdz-isv.isvjcloud.com/wxCartKoi/cartkoi/activity?activityId=xxxxxxx

cron:1 1 1 1 *
============Quantumultx===============
[task_local]
#购物车锦鲤通用活动
1 1 1 1 * jd_wxCartKoi.js, tag=购物车锦鲤通用活动, enabled=true

*/

const $ = new Env('购物车锦鲤通用活动');

const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let lz_cookie = {};
let cookiesArr = [],
    cookie = '';

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach(_0x8d22x6 => {
    cookiesArr.push(jdCookieNode[_0x8d22x6]);
  });

  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') {
    console.log = () => {};
  }
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || '[]').map(_0x8d22x6 => {
    return _0x8d22x6.cookie;
  })].filter(_0x8d22x6 => {
    return !!_0x8d22x6;
  });
}

$.hotFlag = false;
$.outFlag = false;
$.activityEnd = false;
let lz_jdpin_token_cookie = '';
let activityCookie = '';
let jd_wxCartKoi_activityId = '';
jd_wxCartKoi_activityId = $.isNode() ? process.env.jd_wxCartKoi_activityId ? process.env.jd_wxCartKoi_activityId : `${''}${jd_wxCartKoi_activityId}${''}` : $.getdata('jd_wxCartKoi_activityId') ? $.getdata('jd_wxCartKoi_activityId') : `${''}${jd_wxCartKoi_activityId}${''}`;
!(async () => {
  if (!jd_wxCartKoi_activityId) {
    console.log('\n衰仔、请填写购物车锦鲤的活动ID,变量是jd_wxCartKoi_activityId\n');
    return;
  }


  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": 'https://bean.m.jd.com/'
    });
    return;
  }

  $.activityId = jd_wxCartKoi_activityId;
  $.shareUuid = '';
  console.log('入口:\nhttps://lzkjdz-isv.isvjcloud.com/wxCartKoi/cartkoi/activity?activityId=' + $.activityId);

  for (let _0x8d22xb = 0; _0x8d22xb < cookiesArr.length; _0x8d22xb++) {
    cookie = cookiesArr[_0x8d22xb];
    originCookie = cookiesArr[_0x8d22xb];

    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = _0x8d22xb + 1;
      $.bean = 0;
      $.hotFlag = false;
      $.nickName = '';
      console.log('\n开始【京东账号' + $.index + '】' + ($.nickName || $.UserName) + '\n');
      await getUA();
      await run();
      await $.wait(3000);

      if (_0x8d22xb == 0 && !$.actorUuid) {
        break;
      }


      if ($.outFlag || $.activityEnd) {
        break;
      }

      if ($.hasEnd) {
        break;
      }
    }
  }

  cookie = cookiesArr[0];

  if (cookie && $.assistStatus && !$.outFlag && !$.activityEnd) {
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    $.index = 1;
    $.bean = 0;
    $.hotFlag = false;
    $.nickName = '';
    console.log('\n\n开始开始【京东账号' + $.index + '】' + ($.nickName || $.UserName) + '加购物车\n');
    await $.wait(parseInt(Math.random() * 2000 + 2000, 10));
    await getUA();
    await runs();
  }

  if ($.outFlag) {
    let _0x8d22xc = '此ip已被限制，请过10分钟后再执行脚本';
    $.msg($.name, `${''}`, `${''}${_0x8d22xc}${''}`);

    if ($.isNode()) {
      await notify.sendNotify(`${''}${$.name}${''}`, `${''}${_0x8d22xc}${''}`);
    }
  }

  if (allMessage) {
    $.msg($.name, `${''}`, `${''}${allMessage}${''}`);
  }
})().catch(_0x8d22xa => {
  return $.logErr(_0x8d22xa);
}).finally(() => {
  return $.done();
});

async function run() {
  try {
    $.assistCount = 0;
    $.endTime = 0;
    lz_jdpin_token_cookie = '';
    $.Token = '';
    $.Pin = '';
    await takePostRequest('isvObfuscator');

    if ($.Token == '') {
      console.log('获取[token]失败！');
      return;
    }

    await getCk();

    if (activityCookie == '') {
      console.log(`${'获取cookie失败'}`);
      return;
    }


    if ($.activityEnd === true) {
      console.log('活动结束');
      return;
    }

    if ($.outFlag) {
      console.log('此ip已被限制，请过10分钟后再执行脚本\n');
      return;
    }

    await takePostRequest('getSimpleActInfoVo');
    await takePostRequest('getMyPing');

    if (!$.Pin) {
      console.log('获取[Pin]失败！');
      return;
    }

    await takePostRequest('accessLogWithAD');
    await $.wait(1000);
    await takePostRequest('getActMemberInfo');

    if (!$.openCard) {
      $.shopactivityId = '';
      $.joinVenderId = $.venderId;
      await getshopactivityId();

      for (let _0x8d22xb = 0; _0x8d22xb < Array(5).length; _0x8d22xb++) {
        if (_0x8d22xb > 0) {
          console.log(`${'第'}${_0x8d22xb}${'次 重新开卡'}`);
        }

        await joinShop();
        await $.wait(500);

        if ($.errorJoinShop.indexOf('活动太火爆，请稍后再试') == -1) {
          break;
        }
      }
    }

    await takePostRequest('getUserInfo');
    await takePostRequest('activityContent');
    await $.wait(1000);

    if ($.hotFlag) {
      return;
    }

    if (!$.actorUuid) {
      console.log('获取不到[actorUuid]退出执行，请重新执行');
      return;
    }

    if ($.index == 1) {
      console.log('活动获取成功，助力码：' + $.actorUuid + '\n');
      console.log('\n当前参加活动：' + $.activityName + '\n当前参与活动人数：' + $.joins + '\n活动抽奖时间：' + $.drawTime + '\n活动结束时间：' + $.cartEndTime + '\n最低加购：' + $.drawCondition + '才可参与抽奖\n当前已加购：' + $.addCarts + '次\n目前可加购次数：' + $.jsNum + '次\n活动全部加购需：' + $.totals + '次\n');
    }


    console.log($.helpStatus === 2 ? '衰仔、助力成功' : $.helpStatus === 3 ? '活动期间只能助力一次' : $.helpStatus === 4 ? '助力已满，无法助力' : $.helpStatus === 1 ? '已助力其他人' : $.helpStatus === 5 ? '不能助力自己' : $.helpStatus === 6 ? '活动已开奖，无法助力' : '未知-' + $.helpStatus);
    await takePostRequest('followShop');

    if ($.index == 1) {
      let _0x8d22xf = new Date();

      let _0x8d22x10 = timestampToTime(_0x8d22xf);

      if (_0x8d22x10 > $.drawTime) {
        console.log('\n衰仔，抽奖时间到了，开始抽奖');
        await takePostRequest('drawResult');
        $.assistStatus = false;
      } else {
        console.log('\n衰仔，抽奖时间未到，跳过');
        $.assistStatus = true;
      }
    }

    if ($.index == 1) {
      $.helpCount = $.jsNum;
    } else {
      if ($.helpStatus == 2) {
        $.helpCount++;
      }
    }

    console.log('\n');
    console.log(`${'【账号'}${$.index}${'】可加购次数：'}${$.jsNum}${''}${$.index != 1 && ' 【账号1】可加购次数：' + $.helpCount || ''}${''}`);

    if ($.helpCount == $.totals) {
      $.hasEnd = true;
    }


    if ($.outFlag) {
      console.log('此ip已被限制，请过10分钟后再执行脚本\n');
      return;
    }

    if ($.index == 1) {
      $.shareUuid = $.actorUuid;
      console.log(`${'衰仔、全部助力→:'}${$.shareUuid}${''}`);
    }

    if ($.index % 3 == 0) {
      await $.wait(parseInt(Math.random() * 3000 + 3000, 10));
    }
  } catch (e) {
    console.log(e);
  }
}

async function runs() {
  try {
    $.assistCount = 0;
    $.endTime = 0;
    lz_jdpin_token_cookie = '';
    $.Token = '';
    $.Pin = '';
    await takePostRequest('isvObfuscator');

    if ($.Token == '') {
      console.log('获取[token]失败！');
      return;
    }

    await getCk();

    if (activityCookie == '') {
      console.log(`${'获取cookie失败'}`);
      return;
    }


    if ($.activityEnd === true) {
      console.log('活动结束');
      return;
    }


    if ($.outFlag) {
      console.log('此ip已被限制，请过10分钟后再执行脚本\n');
      return;
    }

    await takePostRequest('getSimpleActInfoVo');
    await takePostRequest('getMyPing');

    if (!$.Pin) {
      console.log('获取[Pin]失败！');
      return;
    }

    await takePostRequest('accessLogWithAD');
    await $.wait(1000);
    await takePostRequest('getActMemberInfo');
    await takePostRequest('getUserInfo');
    await takePostRequest('activityContent');
    await $.wait(1000);

    if ($.hotFlag) {
      return;
    }


    if (!$.actorUuid) {
      console.log('获取不到[actorUuid]退出执行，请重新执行');
      return;
    }

    let _0x8d22x12 = parseInt($.jsNum - $.addCarts);

    if (_0x8d22x12 > 0) {
      console.log('衰仔、我开始加购了哟！');

      for (const _0x8d22x13 of $.prodectVos) {
        if (_0x8d22x13.collection == false && _0x8d22x12 > 0) {
          $.productId = _0x8d22x13.productId;
          console.log(`${''}${$.productId}${''}`);
          await takePostRequest('addCart');
          _0x8d22x12--;
          await $.wait(2000);
          await takePostRequest('activityContent');
          await $.wait(2500);
        }
      }
    } else {
      console.log('衰仔，已全部加购了哟！');
    }

    if ($.outFlag) {
      console.log('此ip已被限制，请过10分钟后再执行脚本\n');
      return;
    }

    if ($.index % 3 == 0) {
      await $.wait(parseInt(Math.random() * 3000 + 3000, 10));
    }
  } catch (e) {
    console.log(e);
  }
}

async function takePostRequest(_0x8d22x16) {
  if ($.outFlag) {
    return;
  }

  let _0x8d22x17 = 'https://lzkjdz-isv.isvjcloud.com';
  let _0x8d22x18 = `${''}`;
  let _0x8d22x19 = 'POST';

  switch (_0x8d22x16) {
    case 'isvObfuscator':
      url = `${'https://api.m.jd.com/client.action?functionId=isvObfuscator'}`;
      _0x8d22x18 = `${'body=%7B%22url%22%3A%22https%3A//lzkjdz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&uuid=9a79133855e4ed42e83cda6c58b51881c4519236&client=apple&clientVersion=10.1.4&st=1647263148203&sv=102&sign=53ee02a59dece3c480e3fcb067c49954'}`;
      break;

    case 'getMyPing':
      url = `${''}${_0x8d22x17}${'/customer/getMyPing'}`;
      _0x8d22x18 = `${'token='}${$.Token}${'&fromType=APP&userId='}${$.venderId}${'&pin='}`;
      break;

    case 'getSimpleActInfoVo':
      url = `${''}${_0x8d22x17}${'/customer/getSimpleActInfoVo'}`;
      _0x8d22x18 = `${'activityId='}${$.activityId}${''}`;
      break;

    case 'getActMemberInfo':
      url = `${''}${_0x8d22x17}${'/wxCommonInfo/getActMemberInfo'}`;
      _0x8d22x18 = `${'venderId='}${$.venderId}${'&activityId='}${$.activityId}${'&pin='}${encodeURIComponent($.Pin)}${''}`;
      break;

    case 'accessLogWithAD':
      url = `${''}${_0x8d22x17}${'/common/accessLogWithAD'}`;
      let _0x8d22x1b = `${'https://lzkjdz-isv.isvjcloud.com/wxCartKoi/cartkoi/activity?activityId='}${$.activityId}${'&friendUuid='}${$.shareUuid}${''}`;
      _0x8d22x18 = `${'venderId='}${$.shopId || $.venderId || ''}${'&code=70&pin='}${encodeURIComponent($.Pin)}${'&activityId='}${$.activityId}${'&pageUrl='}${encodeURIComponent(_0x8d22x1b)}${'&subType=app&adSource='}`;
      break;

    case 'getUserInfo':
      url = `${''}${_0x8d22x17}${'/wxActionCommon/getUserInfo'}`;
      _0x8d22x18 = `${'pin='}${encodeURIComponent($.Pin)}${''}`;
      break;

    case 'getOpenCardStatusWithOutSelf':
      url = `${''}${_0x8d22x17}${'/crmCard/common/coupon/getOpenCardStatusWithOutSelf'}`;
      _0x8d22x18 = `${'venderId='}${$.shopId || $.venderId || ''}${'&activityId='}${$.activityId}${'&pin='}${encodeURIComponent($.Pin)}${''}`;
      break;

    case 'activityContent':
      url = `${''}${_0x8d22x17}${'/wxCartKoi/cartkoi/activityContent'}`;
      _0x8d22x18 = `${'activityId='}${$.activityId}${'&pin='}${encodeURIComponent($.Pin)}${'&yunMidImageUrl='}${$.yunMidImageUrl}${'&friendUuid='}${$.shareUuid}${'&status=1'}`;
      break;

    case 'getDrawRecordHasCoupon':
      url = `${''}${_0x8d22x17}${'/wxSecond/myPrize'}`;
      _0x8d22x18 = `${'activityId='}${$.activityId}${'&uuid='}${$.actorUuid}${''}`;
      break;

    case 'drawResult':
      url = `${''}${_0x8d22x17}${'/wxCartKoi/cartkoi/drawResult'}`;
      _0x8d22x18 = `${'activityId='}${$.activityId}${'&pin='}${encodeURIComponent($.Pin)}${'&uuid='}${$.actorUuid}${''}`;
      break;

    case 'followShop':
      url = `${''}${_0x8d22x17}${'/wxActionCommon/followShop'}`;
      _0x8d22x18 = `${'userId='}${$.venderId}${'&activityType=70&buyerNick='}${encodeURIComponent($.Pin)}${'&activityId='}${$.activityId}${''}`;
      break;

    case 'start':
      url = `${''}${_0x8d22x17}${'/wxSecond/start'}`;
      _0x8d22x18 = `${'activityId='}${$.activityId}${'&uuid='}${$.actorUuid}${'&seconds='}${$.targetTime}${''}`;
      break;

    case 'addCart':
      url = `${''}${_0x8d22x17}${'/wxCartKoi/cartkoi/addCart'}`;
      _0x8d22x18 = `${'activityId='}${$.activityId}${'&pin='}${encodeURIComponent($.Pin)}${'&productId='}${$.productId}${''}`;
      break;

    default:
      console.log(`${'错误'}${_0x8d22x16}${''}`);
  }

  let _0x8d22x1c = getPostRequest(url, _0x8d22x18, _0x8d22x19);

  return new Promise(async _0x8d22x1d => {
    $.post(_0x8d22x1c, (_0x8d22x1e, _0x8d22x1f, _0x8d22x20) => {
      try {
        setActivityCookie(_0x8d22x1f);

        if (_0x8d22x1e) {
          if (_0x8d22x1f && typeof _0x8d22x1f.statusCode != 'undefined') {
            if (_0x8d22x1f.statusCode == 493) {
              console.log('此ip已被限制，请过10分钟后再执行脚本\n');
              $.outFlag = true;
            }
          }

          console.log(`${''}${$.toStr(_0x8d22x1e, _0x8d22x1e)}${''}`);
          console.log(`${''}${_0x8d22x16}${' API请求失败，请检查网路重试'}`);
        } else {
          dealReturn(_0x8d22x16, _0x8d22x20);
        }
      } catch (e) {
        console.log(e, _0x8d22x1f);
      } finally {
        _0x8d22x1d();
      }
    });
  });
}

async function dealReturn(_0x8d22x16, _0x8d22x20) {
  let _0x8d22x22 = '';

  try {
    if (_0x8d22x16 != 'accessLogWithAD' || _0x8d22x16 != 'drawContent') {
      if (_0x8d22x20) {
        _0x8d22x22 = JSON.parse(_0x8d22x20);
      }
    }
  } catch (e) {
    console.log(`${''}${_0x8d22x16}${' 执行任务异常'}`);
    console.log(_0x8d22x20);
    $.runFalag = false;
  }

  try {
    switch (_0x8d22x16) {
      case 'isvObfuscator':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.errcode == 0) {
            if (typeof _0x8d22x22.token != 'undefined') {
              $.Token = _0x8d22x22.token;
            }
          } else {
            if (_0x8d22x22.message) {
              console.log(`${'isvObfuscator '}${_0x8d22x22.message || ''}${''}`);
            } else {
              console.log(_0x8d22x20);
            }
          }
        } else {
          console.log(_0x8d22x20);
        }

        break;

      case 'getMyPing':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.result && _0x8d22x22.result === true) {
            if (_0x8d22x22.data && typeof _0x8d22x22.data.secretPin != 'undefined') {
              $.Pin = _0x8d22x22.data.secretPin;
            }

            if (_0x8d22x22.data && typeof _0x8d22x22.data.nickname != 'undefined') {
              $.nickname = _0x8d22x22.data.nickname;
            }
          } else {
            if (_0x8d22x22.errorMessage) {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x22.errorMessage || ''}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          }
        } else {
          console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
        }
        break;

      case 'getSimpleActInfoVo':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.result && _0x8d22x22.result === true) {
            if (typeof _0x8d22x22.data.shopId != 'undefined') {
              $.shopId = _0x8d22x22.data.shopId;
            }

            if (typeof _0x8d22x22.data.venderId != 'undefined') {
              $.venderId = _0x8d22x22.data.venderId;
            }
          } else {
            if (_0x8d22x22.errorMessage) {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x22.errorMessage || ''}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          }
        } else {
          console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
        }
        break;

      case 'getUserInfo':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.result && _0x8d22x22.result === true) {
            $.yunMidImageUrl = _0x8d22x22.data.yunMidImageUrl || '';
          } else {
            if (_0x8d22x22.errorMessage) {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x22.errorMessage || ''}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          }
        } else {
          console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
        }
        break;

      case 'activityContent':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.result && _0x8d22x22.result === true) {
            $.actorUuid = _0x8d22x22.data.joinRecord.myUuid || '';
            $.activityName = _0x8d22x22.data.activityVo.activityName || '';
            $.cartEndTime = _0x8d22x22.data.activityVo.cartEndTime || '';
            $.drawTime = _0x8d22x22.data.activityVo.drawTime || '';
            $.prodectVos = _0x8d22x22.data.prodectVos || [];
            $.helpStatus = _0x8d22x22.data.joinRecord.status || 0;
            $.addCarts = _0x8d22x22.data.addCarts || 0;
            $.joins = _0x8d22x22.data.joins || 0;
            $.jsNum = _0x8d22x22.data.jsNum || 0;
            $.totals = _0x8d22x22.data.totals || 0;
            $.drawCondition = _0x8d22x22.data.activityVo.drawCondition || 0;

            if (_0x8d22x22.data.sendBeanNum) {
              console.log(`${'获得'}${_0x8d22x22.data.sendBeanNum}${'豆'}`);
              allMessage += `${'【账号'}${$.index}${'】获得'}${_0x8d22x22.data.sendBeanNum}${'豆\\n'}`;
            }
          } else {
            if (_0x8d22x22.errorMessage) {
              if (_0x8d22x22.errorMessage.indexOf('结束') > -1) {
                $.activityEnd = true;
              }
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x22.errorMessage || ''}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          }
        } else {
          console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
        }
        break;

      case 'getActMemberInfo':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.result && _0x8d22x22.result === true) {
            $.openCard = _0x8d22x22.data.openCard || false;
          } else {
            if (_0x8d22x22.errorMessage) {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x22.errorMessage || ''}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          }
        } else {
          console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
        }
        break;

      case 'addCart':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.result && _0x8d22x22.result === true) {
            console.log(`${'加购完成'}`);
          } else {
            if (_0x8d22x22.errorMessage) {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x22.errorMessage || ''}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          }
        } else {
          console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
        }
        break;

      case 'followShop':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.result && _0x8d22x22.result === true) {
            console.log(`${'关注成功'}`);
          } else {
            if (_0x8d22x22.errorMessage) {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x22.errorMessage || ''}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          }
        } else {
          console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
        }
        break;

      case 'drawResult':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.result && _0x8d22x22.result === true) {
            if (typeof _0x8d22x22.data == 'object') {
              let _0x8d22xc = '';

              if (_0x8d22x22.data.drawName) {
                _0x8d22xc = `${''}${_0x8d22x22.data.drawName}${''}`;
              }

              if (!_0x8d22xc) {
                _0x8d22xc = '空气💨';
              }
              console.log(`${'获得:'}${_0x8d22xc || _0x8d22x20}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          } else {
            if (_0x8d22x22.errorMessage) {
              $.runFalag = false;
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x22.errorMessage || ''}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          }
        } else {
          console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
        }
        break;

      case 'getDrawRecordHasCoupon':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.result && _0x8d22x22.result === true) {
            console.log(`${'我的奖品：'}`);

            for (let _0x8d22xb in _0x8d22x22.data) {
              $.item = _0x8d22xb.name;
              console.log(`${''}${$.item}${''}`);
            }
          } else {
            if (_0x8d22x22.errorMessage) {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x22.errorMessage || ''}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          }
        } else {
          console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
        }
        break;

      case 'getShareRecord':
        if (typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22.result && _0x8d22x22.result === true && _0x8d22x22.data) {
            $.ShareCount = _0x8d22x22.data.length;
            $.log(`${'=========== 你邀请了:'}${_0x8d22x22.data.length}${'个'}`);
          } else {
            if (_0x8d22x22.errorMessage) {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x22.errorMessage || ''}${''}`);
            } else {
              console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
            }
          }
        } else {
          console.log(`${''}${_0x8d22x16}${' '}${_0x8d22x20}${''}`);
        }
        break;

      case 'accessLogWithAD':
      case 'drawContent':
        break;

      default:
        console.log(`${''}${_0x8d22x16}${'-> '}${_0x8d22x20}${''}`);
    }

    if (typeof _0x8d22x22 == 'object') {
      if (_0x8d22x22.errorMessage) {
        if (_0x8d22x22.errorMessage.indexOf('火爆') > -1) {
          $.hotFlag = true;
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function getPostRequest(_0x8d22x24, _0x8d22x18, _0x8d22x19 = 'POST') {
  let _0x8d22x25 = {
    "Accept": 'application/json, text/javascript, */*; q=0.01',
    "Accept-Encoding": 'gzip, deflate, br',
    "Accept-Language": 'zh-cn',
    "Connection": 'keep-alive',
    "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
    "Cookie": cookie,
    "User-Agent": $.UA,
    "X-Requested-With": 'XMLHttpRequest'
  };

  if (_0x8d22x24.indexOf('https://lzkjdz-isv.isvjcloud.com') > -1) {
    _0x8d22x25.Origin = `${'https://lzkjdz-isv.isvjcloud.com'}`;
    _0x8d22x25.Referer = `${'https://lzkjdz-isv.isvjcloud.com/wxCartKoi/cartkoi/activity?activityId='}${$.activityId}${'&friendUuid='}${$.shareUuid}${''}`;
    _0x8d22x25.Cookie = `${''}${lz_jdpin_token_cookie && lz_jdpin_token_cookie || ''}${''}${$.Pin && 'AUTH_C_USER=' + $.Pin + ';' || ''}${''}${activityCookie}${''}`;
  }

  return {
    url: _0x8d22x24,
    method: _0x8d22x19,
    headers: _0x8d22x25,
    body: _0x8d22x18,
    timeout: 30000
  };
}

function getCk() {
  return new Promise(_0x8d22x1d => {
    let _0x8d22x27 = {
      url: `${'https://lzkjdz-isv.isvjcloud.com/wxCommonInfo/token'}`,
      headers: {
        "Accept": 'application/json, text/plain, */*',
        "Accept-Encoding": 'gzip, deflate, br',
        "Accept-Language": 'zh-cn',
        "Connection": 'keep-alive',
        "Content-Type": 'application/x-www-form-urlencoded',
        "Cookie": cookie,
        "Referer": `${'https://lzkjdz-isv.isvjcloud.com/wxCartKoi/cartkoi/activity?activityId='}${$.activityId}${''}`,
        "User-Agent": $.UA
      },
      timeout: 30000
    };
    $.get(_0x8d22x27, async (_0x8d22x1e, _0x8d22x1f, _0x8d22x20) => {
      try {
        if (_0x8d22x1e) {
          if (_0x8d22x1f && typeof _0x8d22x1f.statusCode != 'undefined') {
            if (_0x8d22x1f.statusCode == 493) {
              console.log('此ip已被限制，请过10分钟后再执行脚本\n');
              $.outFlag = true;
            }
          }
          console.log(`${''}${$.toStr(_0x8d22x1e)}${''}`);
          console.log(`${''}${$.name}${' cookie API请求失败，请检查网路重试'}`);
        } else {
          let _0x8d22x28 = _0x8d22x20.match(/(活动已经结束)/) && _0x8d22x20.match(/(活动已经结束)/)[1] || '';

          if (_0x8d22x28) {
            $.activityEnd = true;
            console.log('活动已结束');
          }
          setActivityCookie(_0x8d22x1f);
        }
      } catch (e) {
        $.logErr(e, _0x8d22x1f);
      } finally {
        _0x8d22x1d();
      }
    });
  });
}

function setActivityCookie(_0x8d22x1f) {
  if (_0x8d22x1f.headers['set-cookie']) {
    cookie = `${''}${originCookie}${';'}`;

    for (let _0x8d22x2a of _0x8d22x1f.headers['set-cookie']) {
      lz_cookie[_0x8d22x2a.split(';')[0].substr(0, _0x8d22x2a.split(';')[0].indexOf('='))] = _0x8d22x2a.split(';')[0].substr(_0x8d22x2a.split(';')[0].indexOf('=') + 1);
    }

    for (const _0x8d22x13 of Object.keys(lz_cookie)) {
      cookie += _0x8d22x13 + '=' + lz_cookie[_0x8d22x13] + ';';
    }
    activityCookie = cookie;
  }
}

async function getUA() {
  $.UA = `${'jdapp;iPhone;10.1.4;13.1.2;'}${randomString(40)}${';network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1'}`;
}

function randomString(_0x8d22xa) {
  _0x8d22xa = _0x8d22xa || 32;
  let _0x8d22x2d = 'abcdef0123456789',
      _0x8d22x2e = _0x8d22x2d.length,
      _0x8d22x2f = '';

  for (i = 0; i < _0x8d22xa; i++) {
    _0x8d22x2f += _0x8d22x2d.charAt(Math.floor(Math.random() * _0x8d22x2e));
  }

  return _0x8d22x2f;
}

function timestampToTime(_0x8d22x31) {
  var _0x8d22x32 = new Date(_0x8d22x31);

  var _0x8d22x33 = _0x8d22x32.getFullYear() + '-';

  var _0x8d22x34 = (_0x8d22x32.getMonth() + 1 < 10 ? '0' + (_0x8d22x32.getMonth() + 1) : _0x8d22x32.getMonth() + 1) + '-';

  var _0x8d22x35 = _0x8d22x32.getDate() + ' ';

  if (_0x8d22x35.length == 2) {
    _0x8d22x35 = '0' + _0x8d22x35;
  }

  var _0x8d22x36 = _0x8d22x32.getHours() + ':';

  var _0x8d22x37 = _0x8d22x32.getMinutes() + ':';

  var _0x8d22x38 = _0x8d22x32.getSeconds();

  return _0x8d22x33 + _0x8d22x34 + _0x8d22x35 + _0x8d22x36 + _0x8d22x37 + _0x8d22x38;
}

function jsonParse(_0x8d22x3a) {
  if (typeof _0x8d22x3a == 'string') {
    try {
      return JSON.parse(_0x8d22x3a);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie');
      return [];
    }
  }
}

async function joinShop() {
  if (!$.joinVenderId) {
    return;
  }

  return new Promise(async _0x8d22x1d => {
    $.errorJoinShop = '活动太火爆，请稍后再试';
    let _0x8d22x3c = `${''}`;

    if ($.shopactivityId) {
      _0x8d22x3c = `${',"activityId":'}${$.shopactivityId}${''}`;
    }

    ;
    let _0x8d22x18 = `${'{"venderId":"'}${$.joinVenderId}${'","shopId":"'}${$.joinVenderId}${'","bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0'}${_0x8d22x3c}${',"channel":406}'}`;

    let _0x8d22x3d = await geth5st();

    const _0x8d22x3e = {
      url: `${'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body='}${_0x8d22x18}${'&clientVersion=9.2.0&client=H5&uuid=88888&h5st='}${_0x8d22x3d}${''}`,
      headers: {
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': cookie,
        'origin': 'https://shopmember.m.jd.com/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
      }
    };
    $.get(_0x8d22x3e, async (_0x8d22x1e, _0x8d22x1f, _0x8d22x20) => {
      try {
        _0x8d22x20 = _0x8d22x20 && _0x8d22x20.match(/jsonp_.*?\((.*?)\);/) && _0x8d22x20.match(/jsonp_.*?\((.*?)\);/)[1] || _0x8d22x20;

        let _0x8d22x22 = $.toObj(_0x8d22x20, _0x8d22x20);

        if (_0x8d22x22 && typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22 && _0x8d22x22.success === true) {
            console.log(_0x8d22x22.message);
            $.errorJoinShop = _0x8d22x22.message;

            if (_0x8d22x22.result && _0x8d22x22.result.giftInfo) {
              for (let _0x8d22xb of _0x8d22x22.result.giftInfo.giftList) {
                console.log(`${'入会获得:'}${_0x8d22xb.discountString}${''}${_0x8d22xb.prizeName}${''}${_0x8d22xb.secondLineDesc}${''}`);
              }
            }
          } else {
            if (_0x8d22x22 && typeof _0x8d22x22 == 'object' && _0x8d22x22.message) {
              $.errorJoinShop = _0x8d22x22.message;
              console.log(`${''}${_0x8d22x22.message || ''}${''}`);
            } else {
              console.log(_0x8d22x20);
            }
          }
        } else {
          console.log(_0x8d22x20);
        }
      } catch (e) {
        $.logErr(e, _0x8d22x1f);
      } finally {
        _0x8d22x1d();
      }
    });
  });
}

async function getshopactivityId() {
  return new Promise(async _0x8d22x1d => {
    let _0x8d22x18 = `${'{"venderId":"'}${$.joinVenderId}${'","channel":406,"payUpShop":true}'}`;

    let _0x8d22x3d = await geth5st();

    const _0x8d22x3e = {
      url: `${'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body='}${_0x8d22x18}${'&clientVersion=9.2.0&client=H5&uuid=88888&h5st='}${_0x8d22x3d}${''}`,
      headers: {
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': cookie,
        'origin': 'https://shopmember.m.jd.com/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
      }
    };
    $.get(_0x8d22x3e, async (_0x8d22x1e, _0x8d22x1f, _0x8d22x20) => {
      try {
        _0x8d22x20 = _0x8d22x20 && _0x8d22x20.match(/jsonp_.*?\((.*?)\);/) && _0x8d22x20.match(/jsonp_.*?\((.*?)\);/)[1] || _0x8d22x20;

        let _0x8d22x22 = $.toObj(_0x8d22x20, _0x8d22x20);

        if (_0x8d22x22 && typeof _0x8d22x22 == 'object') {
          if (_0x8d22x22 && _0x8d22x22.success == true) {
            console.log(`${'入会:'}${_0x8d22x22.result.shopMemberCardInfo.venderCardName || ''}${''}`);
            $.shopactivityId = _0x8d22x22.result.interestsRuleList && _0x8d22x22.result.interestsRuleList[0] && _0x8d22x22.result.interestsRuleList[0].interestsInfo && _0x8d22x22.result.interestsRuleList[0].interestsInfo.activityId || '';
          }
        } else {
          console.log(_0x8d22x20);
        }
      } catch (e) {
        $.logErr(e, _0x8d22x1f);
      } finally {
        _0x8d22x1d();
      }
    });
  });
}

function generateFp(){
	let _0x29b403='0123456789';
	let _0xb1ece4=13;
	let _0x17b84a='';
	for(;_0xb1ece4--;)_0x17b84a+=_0x29b403[Math.random()*_0x29b403.length|0x0];
	return (_0x17b84a+Date.now()).slice(0,16);
}
function geth5st(){
	let _0x2beee2=Date.now();
	let _0x1b782c=generateFp();
	let _0x14e516=new Date(_0x2beee2).Format('yyyyMMddhhmmssSSS');
	let _0x49d9e2=[';ef79a;tk02w92631bfa18nhD4ubf3QfNiU8ED2PI270ygsn+vamuBQh0lVE6v7UAwckz3s2OtlFEfth5LbQdWOPNvPEYHuU2Tw;b01c7c4f99a8ffb2b5e69282f45a14e1b87c90a96217006311ae4cfdcbd1a932;3.0;',';169f1;tk02wc0f91c8a18nvWVMGrQO1iFlpQre2Sh2mGtNro1l0UpZqGLRbHiyqfaUQaPy64WT7uz7E/gujGAB50kyO7hwByWK;77c8a05e6a66faeed00e4e280ad8c40fab60723b5b561230380eb407e19354f7;3.0;'];
	let _0x5ee515=_0x49d9e2[random(0,_0x49d9e2.length)];
	return encodeURIComponent((_0x14e516+';')+_0x1b782c+_0x5ee515+Date.now());
}
Date.prototype.Format=function(_0x1ec4bb){
	var _0x2273ef,_0x25ac60=this,_0x334d9c=_0x1ec4bb,_0x3fc1ee={'M+':_0x25ac60.getMonth()+1,'d+':_0x25ac60.getDate(),'D+':_0x25ac60.getDate(),'h+':_0x25ac60.getHours(),'H+':_0x25ac60.getHours(),'m+':_0x25ac60.getMinutes(),'s+':_0x25ac60.getSeconds(),'w+':_0x25ac60.getDay(),'q+':Math.floor(_0x25ac60.getMonth()+3/3),'S+':_0x25ac60.getMilliseconds()};
	/(y+)/i.test(_0x334d9c)&&(_0x334d9c=_0x334d9c.replace(RegExp.$1,''.concat(_0x25ac60.getFullYear()).substr(4-RegExp.$1.length)));
	for(var _0xd76021 in _0x3fc1ee){
		if(new RegExp('('.concat(_0xd76021,')')).test(_0x334d9c)){
			var _0x6ee06d,_0x2c5f41=('S+'===_0xd76021)?'000':'00';
			_0x334d9c=_0x334d9c.replace(RegExp.$1,(1==RegExp.$1.length)?_0x3fc1ee[_0xd76021]:(''.concat(_0x2c5f41)+_0x3fc1ee[_0xd76021]).substr(''.concat(_0x3fc1ee[_0xd76021]).length));
		}
	}
	return _0x334d9c;
};
function random(_0x49d667,_0x34bf6a){
	return Math.floor(Math.random()*_0x34bf6a-_0x49d667)+_0x49d667;
};


// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

