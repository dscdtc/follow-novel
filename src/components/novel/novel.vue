<template>
  <div class="novel" v-if="bookshelf.length > 0">
    <scroll
      class="novel-list"
      ref="scroll"
      :probeType="3"
      :data="bookshelf"
      :listenScroll="true"
      :pullDownRefresh="pullDownRefresh"
      @pullingDown="_refresh"
      @scroll="scroll"
    >
      <ul>
        <transition name="loading">
          <div :style="direction" class="loading">
            <i v-if="!refresh" v-show="scrollY > 0" class="icon icon-arrow-down" />
            <i v-if="refresh" v-show="!isLoaded" class="icon icon-loading" />
            <i v-if="refresh" v-show="isLoaded" class="icon icon-ok" />
          </div>
        </transition>
        <li v-for="novel in bookshelf" class="novel-item" @click="toContent(novel._id)">
          <div class="img">
            <img width="45" height="55" v-lazy="proxyUrl+novel.cover" />
          </div>
          <div class="info">
            <h2 class="title">{{novel.title}}</h2>
            <span class="update">{{computeTime(novel.updated)}}:{{novel.lastChapter}}</span>
          </div>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
import scroll from 'comp/scroll/scroll'
import {getInfo} from 'api/get'
import {quickSort} from 'common/js/util.js'

export default {
  data () {
    return {
      bookshelf: [],
      proxyUrl: 'http://statics.zhuishushenqi.com',
      scrollY: 0,
      refresh: false,
      isLoaded: true,
      pullDownRefresh: {
        threshold: 50,
        stop: 80
      }
    }
  },
  created () {
    this._getBookshelf()
  },
  methods: {
    _getBookshelf () {
      getInfo('bookshelf')
      .then((res) => {
        if (res.ok === true) {
          this.bookshelf = res.bookshelf || []
          this.bookshelf = quickSort(this.bookshelf)
        }
      })
    },
    computeTime (utc) {
      // UTC时间字符串："2017-06-18T07:33:57.921Z"
      // let timeStr = updated.split('.')[0].replace(/-/g, '/').replace('T', ' ')
      // let oldDate = new Date(timeStr)
      let oldDate = new Date(utc)
      let nowDate = new Date()
      let days = ((nowDate - oldDate) / (1000 * 3600 * 24)) >>> 0
      if (days) {
        return `${days}天前`
      }
      let hours = ((nowDate - oldDate) / (1000 * 3600)) >>> 0
      if (hours) {
        return `${hours}小时前`
      }
      let minutes = ((nowDate - oldDate) / (1000 * 60)) >>> 0
      if (minutes) {
        return `${minutes}分钟前`
      } else {
        return '刚刚'
      }
    },
    scroll (pos) {
      this.scrollY = Math.round(pos.y)
    },
    _refresh () {
      this.refresh = true
      if (!this.isLoaded) {
        this.refresh = false
        return
      }
      this.isLoaded = false
      this._getBookshelf()
      setTimeout(() => {
        this.isLoaded = true
      }, 1500)
      setTimeout(() => {
        this.refresh = false
      }, 2500)
      this.$refs.scroll.finishPullDown()
    },
    toContent (id) {
      this.$store.dispatch('saveBookId', id)
      this.$router.push({
        path: '/reader'
      })
    }
  },
  computed: {
    direction () {
      if (this.scrollY > 40) {
        return {transform: 'rotateZ(540deg)'}
      }
    }
  },
  components: {
    scroll
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import '../../common/stylus/mixin'
  .novel
    position absolute
    top 117px
    bottom 0
    width 100%
    font-size 0
    background #e5e5e5
    .novel-list
      height 100%
      overflow hidden
      .loading
        &.loading-enter-active, &.loading-leave-active
          transition all .5s ease
        &.loading-enter, &.loading-leave-to
          transform scaleY(10px)
          opacity 0
        width 100%
        text-align center
        transition transform 1s
        .icon
          padding 16px
          font-size 18px
          font-weight bold
          color #b93221
      .novel-item
        display flex
        .img
          padding 12px
          img
            border-radius 3px // ???????
        .info
          padding 12px 0
          height 55px
          width 100%
          border-1px(rgba(7,17,27,.1))
          .title
            line-height 35px
            font-size 16px
            font-weight 250
            color #212121
          .update
            display block
            width 258px
            font-size 12px
            color #727272
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
</style>