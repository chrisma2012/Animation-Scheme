/*
 * @Author: Chris
 * @Date: 2023-08-29 10:01:01
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-30 14:58:05
 * @FilePath: \PagTest\src\components\animationPlayer\LottiePlayer.tsx
 * @Description: lottie动画播放方案 更多使用方法请参考https://www.npmjs.com/package/lottie-web
 *
 * Copyright (c) 2023 by aiyiyun, All Rights Reserved.
 */

import { type lottiePlayerType } from '@/types/animationPlayer';
import lottie, { type AnimationItem } from 'lottie-web';
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'LottiePlayer',
  emits: ['ready'],
  props: {
    conf: {
      type: Object,
      require: true,
    },
  },
  setup(props, { emit }) {
    const lottieAnchor = ref<any>(null);
    const {
      url: path,
      width = 180,
      height = 40,
      useType = 2,
      loop = 0,
      renderer = 'svg',
      autoplay = true,
      onStartPlay,
      onEnded,
      onPlaying,
      onDestory,
      onLoadError,
    } = props.conf as lottiePlayerType;

    const lifeCycleEvent = (player: AnimationItem) => {
      // export type AnimationEventName =
      // 'drawnFrame' | 'enterFrame' | 'loopComplete' | 'complete' | 'segmentStart' | 'destroy' |
      //  'config_ready' | 'data_ready' | 'DOMLoaded' | 'error' | 'data_failed' | 'loaded_images';

      // player.addEventListener('complete', () => {
      //     console.log('完成----')
      // })
      player.addEventListener('loopComplete', () => {
        if (onEnded) onEnded(player);
      });
      player.addEventListener('DOMLoaded', () => {
        // console.log('dom已经挂载')
        if (onStartPlay) onStartPlay(player);
      });
      player.addEventListener('drawnFrame', () => {
        if (onPlaying) onPlaying(player);
      });
    };

    watch(
      () => props.conf?.url,
      (value) => {
        lottie.destroy();
        lottie.loadAnimation({
          container: lottieAnchor.value, // the dom element that will contain the animation
          path: value, // the path to the animation json
          renderer,
          loop,
          autoplay, //如果是纯展示型的自动播放
        });
      }
    );

    onMounted(() => {
      lottieAnchor.value.style.width = width + 'px';
      lottieAnchor.value.style.height = height + 'px';
      // anotherLottie与lottie不同，destroy方法只存在lottie上，lifecycle方法存在anotherLottie上
      const anotherLottie = lottie.loadAnimation({
        container: lottieAnchor.value, // the dom element that will contain the animation
        path, // the path to the animation json
        renderer,
        loop,
        autoplay, //如果是纯展示型的自动播放
      });
      if (useType === 2) {
        //交互型
        lifeCycleEvent(anotherLottie);
        emit('ready', { player: lottie });
      }
    });

    onUnmounted(() => {
      lottie.destroy();
    });

    return () => <div ref={lottieAnchor}> </div>;
  },
});
