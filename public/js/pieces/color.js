t=0;draw=_=>{t++||noFill(createCanvas(w=1000,w),colorMode(HSB,1));blendMode(BLEND);background(0);blendMode(SCREEN);for(i=0;i<w;i+=4){n=a=>noise(a*t*.001,i)*i;stroke(i/w,1,1,.5);bezier(-w*.5,w/2,n(1),n(4),w-n(2),w-n(3),w*1.5,w/2)}}

// t=0;draw=_=>{t++||noFill(createCanvas(w=600,w),colorMode(HSB,1));blendMode(BLEND);background(0);blendMode(SCREEN);for(i=0;i<w;i+=4){n=a=>noise(a*t*.001,i)*i;stroke(i/w,1,1,.5);
//                                                                                                                                     bezier(n(5),w/2,n(1),n(4),w-n(2),w-n(3),w-n(5),w/2)
//          bezier(n(5),w/2,n(1.5),w-n(4.5),w-n(2.5),n(3.5),w-n(5),w/2)                                                                                                                          }