import("stdfaust.lib");

commonPitch = hslider("[0][style:radio{'B':14;'A#':13;'A':12;'G#':11;'G':10;'F#':9;'F':8;'E':7;'D#':6;'D':5;'C#':4;'C':3}]Pitch",3,3,14,1);
fineTune = hslider("Fine_Tune",0,-100,100,1);

freq = 110*(2^(commonPitch/12))*(2^(fineTune/1200));
delta = 0.25;
sharpness = 0.5;
cperiod = 12;
cgain = 0.4;
gate = os.lf_pulsetrainpos(1/cperiod,0.1);
g1 = gate + (gate : @(ma.SR*cperiod*2/3));
g2 = (gate : @(ma.SR*cperiod/3)) + (gate : @(ma.SR*cperiod*2/3));
env1 = en.adsr(0.01,cperiod/2,0.3,cperiod/8,g1);
env2 = en.adsr(0.01,cperiod/2,0.3,cperiod/8,g2);

string1 = os.osc(2*(freq-delta)) : *(env1) : *(cgain);
string2 = os.osc(2*(freq+delta)) : *(env2) : *(cgain);

mix(l,r) = 0.7*l+0.3*r,0.3*l+0.7*r;

process = hgroup("Motif",(string1, string2 : mix)) : @(ma.SR*0.01),@(ma.SR*0.01) : dm.zita_light;
