//   _____           _ _                           _   __  __           _       __          __        _        
//  / ____|         | | |                         (_) |  \/  |         (_)      \ \        / /       | |       
// | (___   __ _  __| | |__   __ _ _ __ __ _ _ __  _  | \  / |_   _ ___ _  ___   \ \  /\  / /__  _ __| | _____ 
//  \___ \ / _` |/ _` | '_ \ / _` | '__/ _` | '_ \| | | |\/| | | | / __| |/ __|   \ \/  \/ / _ \| '__| |/ / __|
//  ____) | (_| | (_| | | | | (_| | | | (_| | | | | | | |  | | |_| \__ \ | (__     \  /\  / (_) | |  |   <\__ \
// |_____/ \__,_|\__,_|_| |_|\__,_|_|  \__,_|_| |_|_| |_|  |_|\__,_|___/_|\___|     \/  \/ \___/|_|  |_|\_\___/
//
// PureTones Drone Six - Developed by Aravind Iyer and S Balachander, Sadharani Music Works
// A Six string version which offers a few more advanced features than puretones-drone.dsp which has four strings
//

import("stdfaust.lib");

PureTonesString(coarsefreq,period,finetune,ratio,variance,delay) = string(freq*(1+delta)/2,gamma) + string(freq*(1-delta)/2,gamma) : *(gain)
  with {
    finecent = vslider("[02]Fine Tune",finetune,-100,100,1);
    fineratio = 2^(finecent/1200);
    ultrafinecent = vslider("[03]Ultrafine Tune",0,-100,100,1);
    ultrafineratio = 2^(ultrafinecent/120000);
    ratioselector = vslider("[001][style:radio{'SA':0;'Ni^':1;'Ni_':2;'Dha^':3;'Dha_':4;'Pa':5;'Ma^':6;'Ma_':7;'Ga^':8;'Ga_':9;'Re^':10;'Re_':11;'Sa':12}]Select Note",ratio,0,12,1);
    ratioselected = 2,243/128,16/9,27/16,128/81,3/2,729/512,4/3,81/64,32/27,9/8,256/243,1 : ba.selectn(13,ratioselector);
    freq = ratioselected*coarsefreq*fineratio*ultrafineratio;
    delta = ratioselected*vslider("[04]Variance",variance,0,20,0.1)/10000;
    gamma = 0.5;
    gate = vgroup("[00]Play String",checkbox("[1]Loop")*os.lf_pulsetrainpos(1/period,0.3):@(ma.SR*delay*period) + button("[0]Once"));
    gain = 10^((vslider("[08]Gain",0,-20,20,0.1)-18) : /(20))/ratioselected;
    
    envelope1 = en.adsr(0.1*period,0.3*period,0.2,0.3*period,gate);
    envelope2 = en.adsr(0.2*period,0.4*period,0.4,0.4*period,gate);
    envelope3 = 0.95*en.adsr(0.1*period,0.5*period,0.6,0.5*period,gate) + 0.05;
    fullstring(f,n1,n2,g) = ((g^(n2+2-n1))*os.osc(f*n2) + os.osc(f*n1) - (g^(n2+1-n1))*os.osc(f*(n2+1)) - g*os.osc(f*(n1-1)))/(1+g^2-2*g*os.osccos(f));
    octave1gain = vslider("[11]Octave 1", 5.6,0,10,0.1)*0.04; 	
    octave2gain = vslider("[11]Octave 2", 7.8,0,10,0.1)*0.04; 	
    octave3gain = vslider("[12]Octave 3", 5.6,0,10,0.1)*0.03; 
    octave4gain = vslider("[13]Octave 4", 1,0,10,0.1)*0.04; 	
    octave5gain = vslider("[14]Octave 5", 0.4,0,10,0.1)*0.01; 
    octave6gain = vslider("[15]Octave 6", 0.2,0,10,0.1)*0.003;
    string1(f,g) = octave6gain*fullstring(f,32,64,g) + octave5gain*fullstring(f,16,32,g) : *(envelope1);  
    string2(f,g) = octave4gain*fullstring(f,8,16,g) + octave3gain*fullstring(f,4,8,g) : *(envelope2);  
    string3(f,g) = octave1gain*(os.osc(f)+1.42*os.osc(2*f)) + octave2gain*fullstring(f,2,4,g) : *(envelope3);
    string(f,g) = string1(f,g) + string2(f,g) + string3(f,g);
};

PureTones(c,p) = hgroup("[0]",(c,p)) : PureTonesSystem
  with {
    string1(c,p) = hgroup("[1]1st String",PureTonesString(c,p-0.2,0,5,5,0));
    string2(c,p) = hgroup("[2]2nd String",PureTonesString(c,p-0.2,0,0,5,0.3));
    string3(c,p) = hgroup("[3]3rd String",PureTonesString(c,p-0.2,0,12,5,0.6));
    string4(c,p) = hgroup("[4]4th String",PureTonesString(c,p+0.2,0,5,5,0.5));
    string5(c,p) = hgroup("[5]5th String",PureTonesString(c,p+0.2,0,0,5,0.8));
    string6(c,p) = hgroup("[6]6th String",PureTonesString(c,p+0.2,0,12,5,0.1));

    PureTonesLeft(c,p) = (c,p) <: _,_,_,_,_,_ : tgroup("[1]",string1,string2,string3) :> _;
    PureTonesRight(c,p) = (c,p) <: _,_,_,_,_,_ : tgroup("[1]",string4,string5,string6) :> _;
    PureTonesSystem(c,p) = PureTonesLeft(c,p), PureTonesRight(c,p);
};

coarseselector = vslider("[0][style:radio{'B':14;'A#':13;'A':12;'G#':11;'G':10;'F#':9;'F':8;'E':7;'D#':6;'D':5;'C#':4;'C':3}]Common Frequency",11,3,14,1);
coarse = 110*(2^(coarseselector/12));
octaveselector = vslider("[1][style:radio{'High':1;'Medium':0;'Low':-1}]Octave Selector",0,-1,1,1);
finecent = vslider("[2]Fine Tune",0,-100,100,1);
fineratio = 2^(finecent/1200);
period = vslider("[3]Period",7,4,10,0.5);

process = hgroup("[00]PureTones v1.0", PureTones(coarse*fineratio*(2^octaveselector),period)) <: dm.zita_light;
