/**
 * 快速生成三级联动插件
 * author: microzz
 * site: https://microzz.com/
 */
class Select {
  constructor(parent='body',
              data=select_plugin_default_data,
              id=['province', 'city', 'area'],
              text=['省', '市', '区']) {
    this.parent = this.findDOM(parent);
    this.data = data;
    // 设置一个一级菜单的公共下标
    this.pIndex = -1;
    this.id = id;
    this.text = text;
    this.insertEle(this.parent);
    this._self = this;
  }

  // 查找DOM元素
  findDOM(str) {
    return document.querySelector(str);
  }

  insertEle(oParent) {
    this._self = this;
    let html = '';
    let DOM = {};
    let oDiv = document.createElement('div');
    oDiv.className = 'select-plugin';
    Object.keys(this.data).forEach( (item, index) => {
      if (index === 0) {
        html += `<span>${this.text[index] || item}</span>
                <select id="${this.id[index] || ('select'+index)}">
                    <option>请选择</option>
                 </select>`;
      } else {
        html += `<span>${this.text[index] || item}</span>
                <select id="${this.id[index] || ('select'+index)}">
                    <option></option>
                 </select><span>${this.text[index] || item}</span>`;
      }

    });

    oDiv.innerHTML = html;
    oParent.appendChild(oDiv);

    // 把相关DOM元素封装在DOM对象里面
    Object.keys(this.data).forEach( (item, index) => {
      DOM['o' + index] = this.findDOM('#' + this.id[index]) || this.findDOM('#select' + index);
    });

    // 初始化第一级菜单的值
    this.data[Object.keys(this.data)[0]].forEach( (item, index) => {
      // new Option(displayVal, value)
      let option = new Option(item, index);
      DOM[Object.keys(DOM)[0]].options.add(option);
    });


    DOM[Object.keys(DOM)[0]].onchange = changeOne.bind(this._self, DOM[Object.keys(DOM)[0]]);
    DOM[Object.keys(DOM)[1]].onchange = changeTwo.bind(this._self, DOM[Object.keys(DOM)[1]]);

    // 一级菜单change事件
    function changeOne(obj) {
      let val = obj.value;
      this.pIndex = val;
      let DOM = {};
      // 把相关DOM元素封装在DOM对象里面
      Object.keys(this.data).forEach( (item, index) => {
        DOM['o' + index] = this.findDOM('#' + this.id[index]) || this.findDOM('#select' + index);
      });

      DOM[Object.keys(DOM)[1]].options.length = 0;
      DOM[Object.keys(DOM)[2]].options.length = 0;

      // cities[val] = cities[val] || []; // 防止选中 ‘请选择’ 时报错
      this.data[Object.keys(this.data)[1]][val] = this.data[Object.keys(this.data)[1]][val] || [];

      this.data[Object.keys(this.data)[1]][val].forEach( (item, index) => {
        let option = new Option(item, index);
        DOM[Object.keys(DOM)[1]].options.add(option);
      });

      this.data[Object.keys(this.data)[2]][val] = this.data[Object.keys(this.data)[2]][val] || [[]]; // 防止选中 ‘请选择’ 时报错

      // 市辖区
      if (this.data[Object.keys(this.data)[1]][val].length == 1 ) {
        this.data[Object.keys(this.data)[2]][val].forEach( (item, index) => {
          let option = new Option(item, index);
          DOM[Object.keys(DOM)[2]].options.add(option);
        })
      } else {
        this.data[Object.keys(this.data)[2]][val][0].forEach( (item, index) => {
          let option = new Option(item, index);
          DOM[Object.keys(DOM)[2]].options.add(option);
        })
      }

    }

    // 二级菜单change事件
    function changeTwo(obj) {
      let val = obj.value;
      DOM[Object.keys(DOM)[2]].length = 0;

      this.data[Object.keys(this.data)[2]][this.pIndex][val].forEach( (item, index) => {
        let option = new Option(item, index);
        DOM[Object.keys(DOM)[2]].add(option);
      });
    }

  }

}
