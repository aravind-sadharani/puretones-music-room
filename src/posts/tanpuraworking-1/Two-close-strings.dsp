import("stdfaust.lib");

commonPitch = hslider("[0][style:radio{'B':14;'A#':13;'A':12;'G#':11;'G':10;'F#':9;'F':8;'E':7;'D#':6;'D':5;'C#':4;'C':3}]Pitch",3,3,14,1);
fineTune = hslider("Fine_Tune",0,-100,100,1);

String2Tone(f,r,g) = StringModel(pm.f2l(f*r),StringPluck) : *(StringEnv)
with {
    StringPluck = en.adsr(0.00001,cperiod*0.7,0.9,cperiod*0.3,g);
    StringEnv = en.adsr(0.0001,cperiod*0.7,0.9,cperiod*0.4,g);
    
    StringModel(length,excitation) = 2*pm.endChain(egChain)
    with{
        brightness = 0.6/((length)^(1/3));
        stiffness = 25*((length)^(1/3));
        pluckPosition = 0.61;
        StringBody(stringL,excitation) = reflectance,transmittance,_
        with{
            c = (0.375*(stringL^(1/4)) - 0.0825);
            transmittance = _ <: *(1-c),1*c*fi.resonbp(pm.l2f(stringL),2,1) :> _;
            reflectance = _;
        };
        StringBridge(brightness) = pm.rTermination(pm.basicBlock,reflectance) : _,transmittance,_
        with{
            reflectance = (-1)*pm.bridgeFilter(brightness,0);
            transmittance = _;
        };
        openStringPick(length,stiffness,pluckPosition,excitation) = strChain
        with{
            dispersionFilters = par(i,2,si.smooth(stiffness)),_;
            maxStringLength = 6;
            nti = length*pluckPosition; // length of the upper portion of the string
            itb = length*(1-pluckPosition); // length of the lower portion of the string
            strChain = pm.chain(
                pm.stringSegment(maxStringLength,nti) :
                pm.in(excitation) :
                dispersionFilters :
                pm.stringSegment(maxStringLength,itb)
            );
        };
        lengthTuning = 13*pm.speedOfSound/ma.SR;
        stringL = length-lengthTuning;
        egChain = pm.chain(
            pm.lStringRigidTermination :
            openStringPick(stringL,stiffness/1000,pluckPosition,excitation) :
            StringBridge(brightness) : 
            StringBody(length,excitation) :
            pm.out
        );
    };
};

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

string1 = String2Tone(freq-delta,1,g1) : *(env1) : *(cgain);
string2 = String2Tone(freq+delta,1,g2) : *(env2) : *(cgain);

mix(l,r) = 0.7*l+0.3*r,0.3*l+0.7*r;

process = hgroup("Motif",(string1, string2 : mix)) : @(ma.SR*0.01),@(ma.SR*0.01) : dm.zita_light;
