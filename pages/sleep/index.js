const storage = require('../../services/storage');
const navigation = require('../../utils/navigation');
const { getNavigationMetrics } = require('../../utils/layout');

Page({
  data: {
    bedTime: '23:00',
    wakeTime: '07:00',
    feeling: 3,
    duration: '8 小时',
    records: [],
    feelings: [1, 2, 3, 4, 5],
    nav: getNavigationMetrics()
  },
  onLoad() { this.setData({ records: storage.read(storage.KEYS.sleep, []) }); },
  onShow() { this.setData({ nav: getNavigationMetrics() }); },
  goBack() { navigation.backOrHome(); },
  onBedChange(event) { this.setData({ bedTime: event.detail.value }, () => this.calculateDuration()); },
  onWakeChange(event) { this.setData({ wakeTime: event.detail.value }, () => this.calculateDuration()); },
  setFeeling(event) { this.setData({ feeling: Number(event.currentTarget.dataset.value) }); },
  calculateDuration() {
    const [bedHour, bedMinute] = this.data.bedTime.split(':').map(Number);
    const [wakeHour, wakeMinute] = this.data.wakeTime.split(':').map(Number);
    let minutes = wakeHour * 60 + wakeMinute - (bedHour * 60 + bedMinute);
    if (minutes <= 0) minutes += 24 * 60;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    this.setData({ duration: `${hours} 小时${rest ? ` ${rest} 分钟` : ''}` });
  },
  saveSleep() {
    const now = new Date();
    const records = storage.read(storage.KEYS.sleep, []);
    records.unshift({ id: `sleep-${Date.now()}`, bedTime: this.data.bedTime, wakeTime: this.data.wakeTime, feeling: this.data.feeling, duration: this.data.duration, date: `${now.getMonth() + 1} 月 ${now.getDate()} 日` });
    storage.write(storage.KEYS.sleep, records.slice(0, 30));
    this.setData({ records: records.slice(0, 30) });
    wx.showToast({ title: '已经记下', icon: 'none' });
  }
});
