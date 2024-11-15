/*
 * @Author: Chris
 * @Date: 2023-08-29 10:01:01
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-30 14:43:27
 * @FilePath: \PagTest\src\components\animationPlayer\PagPlayer.tsx
 * @Description: Pag动效播放方案，接口方法请查阅node_modules/libpag/types/pag-view.d.ts
 *
 * Copyright (c) 2023 by aiyiyun, All Rights Reserved.
 */
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { PAGInit } from 'libpag';
import type { PagPlayerPropsType } from '@/types/animationPlayer';
import type { PAGView } from 'libpag/types/pag-view';
import type { PAG } from 'libpag/types/types';

const loadFile = (url: string, callback: Function) => {
  fetch(url)
    .then((response) => response.blob())
    .then(async (blob) => {
      const file = new window.File([blob], url.replace(/(.*\/)*([^.]+)/i, '$2'));
      callback && callback(file);
    });
};

let PAGInstance: PAG  = await PAGInit();


export default defineComponent({
  name: 'PagPlayer',
  emits: ['ready'],
  props: {
    conf: {
      type: Object,
      require: true,
    },
  },
  setup(props, context) {
    const { emit } = context;
    const canvasRef = ref<any>(null);
    const { url, useType, width, height, loop, onStartPlay, onEnded, onPlaying, onDestory, onLoadError } =
      props.conf as PagPlayerPropsType;

    let pagView: PAGView | undefined = undefined;
    const lifeCycleEvent = (player: PAGView) => {
      player.addListener('onAnimationStart', () => {
        if (onStartPlay) onStartPlay(player);
        console.log('开始播放pag动画');
      });
      // player.addListener('onAnimationEnd', () => {
      //     console.log('结束播放pag动画')
      // })
      player.addListener('onAnimationCancel', () => {
        if (onEnded) onEnded(player);
        console.log('结束播放pag动画');
      });
      // player.addListener('onAnimationRepeat', () => {
      //     console.log('开始重复播放pag动画')
      // })
      player.addListener('onAnimationUpdate', () => {
        if (onPlaying) onPlaying(player);

        console.log('动画播放中');
      });
      // player.addListener('onAnimationPause', () => {
      //     console.log('动画暂停')
      // })
      // pagView.addListener('onAnimationPlay', () => {
      //     console.log('pag动画正在播放')
      // })
    };
      
    const paginit = async (file: File) => {
      pagView?.destroy();
      const pagFile = await (PAGInstance as PAG).PAGFile.load(file);
      console.log(pagFile.width(),pagFile.height())
      canvasRef.value.width = width || pagFile.width();
      canvasRef.value.height = height || pagFile.height();
      pagView = await (PAGInstance as PAG).PAGView.init(pagFile, canvasRef.value);
      (pagView as any).setRepeatCount(typeof loop === 'undefined' ? 0 : loop);
      //交互型
      if (useType === 2) {
        lifeCycleEvent(pagView as PAGView);
        // 此处只作暴露动画播放器对象
        emit('ready', { player: pagView });
      } else {
        //展示型
        await (pagView as any).play();
      }
    };
    onMounted(() => {
      loadFile(url, paginit);
    });

    onUnmounted(() => {
      // pagView?.freeCache();
      pagView?.destroy();
    });

    watch(
      () => props.conf?.url,
      (value) => {
        if(/\.pag/i.test(value))
        loadFile(value, paginit);
      }
    );

    return () => (
      <canvas class="canvas" ref={canvasRef}>
        {' '}
      </canvas>
    );
  },
});
