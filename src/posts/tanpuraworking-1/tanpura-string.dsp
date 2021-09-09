import("stdfaust.lib");

PureTonesString(coarsefreq,period,finetune,variance,delay) = string(freq*(1+delta)/2,gamma) + string(freq*(1-delta)/2,gamma) : *(gain)
  with {
    freq = coarsefreq;
    delta = vslider("[04]Variance",variance,0,20,0.1)/10000;
    gamma = 0.5;
    gate = vgroup("[00]Play String",os.lf_pulsetrainpos(1/period,0.3):@(ma.SR*delay*period));
    gain = 10^((vslider("[08]Gain",0,-20,20,0.1)-6) : /(20));
    
    envelope1 = en.adsr(0.1*period,0.3*period,0.2,0.3*period,gate);
    envelope2 = en.adsr(0.2*period,0.4*period,0.4,0.4*period,gate);
    envelope3 = en.adsr(0.1*period,0.5*period,0.6,0.5*period,gate);
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

commonPitch = hslider("[0][style:radio{'B':14;'A#':13;'A':12;'G#':11;'G':10;'F#':9;'F':8;'E':7;'D#':6;'D':5;'C#':4;'C':3}]Pitch",3,3,14,1);
fineTune = hslider("Fine_Tune",0,-100,100,1);
_voice_1cpitch = 110*(2^(commonPitch/12))*(2^(fineTune/1200))*(2^(0));

period = vslider("[3]Period",7,4,10,0.5);

process = hgroup("Motif", PureTonesString(_voice_1cpitch,period,0,5,0)) <: dm.zita_light;
