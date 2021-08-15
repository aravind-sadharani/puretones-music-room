import("stdfaust.lib");
freq = hslider("freq",200,50,1000,0.01);
bend = ba.semi2ratio(hslider("bend[midi:pitchwheel]",0,-6,6,0.01)) : si.polySmooth(gate,0.999,1);
gain = hslider("gain",0.5,0,1,0.01);
gate = button("gate") : en.adsr(0,0,1,0.01);
cperiod = hslider("Common_Parameters/Period",2,0,3,0.1);

midiKey = ba.hz2midikey(freq);
rootKey = hslider("[0][style:radio{'B':14;'A#':13;'A':12;'G#':11;'G':10;'F#':9;'F':8;'E':7;'D#':6;'D':5;'C#':4;'C':3}]Common_Parameters/Pitch",3,3,14,1) - 3;
octave = hslider("Common_Parameters/Octave",0,-2,2,1);
noteId = (midiKey + octave*12 - rootKey) : %(12);
fineTune = hslider("Common_Parameters/Fine_Tune",0,-100,100,1);

offsetSa = 0 + hslider("Common_Parameters/12_Note_Scale/Sa/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/Sa/0.01_Cent",0,-100,100,1);
offsetre = -9.78 + hslider("Common_Parameters/12_Note_Scale/re/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/re/0.01_Cent",0,-100,100,1);
offsetRe = 3.91 + hslider("Common_Parameters/12_Note_Scale/Re/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/Re/0.01_Cent",0,-100,100,1);
offsetga = -5.87 + hslider("Common_Parameters/12_Note_Scale/ga/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/ga/0.01_Cent",0,-100,100,1);
offsetGa = 7.82 + hslider("Common_Parameters/12_Note_Scale/Ga/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/Ga/0.01_Cent",0,-100,100,1);
offsetma = -1.96 + hslider("Common_Parameters/12_Note_Scale/ma/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/ma/0.01_Cent",0,-100,100,1);
offsetMa = 11.73 + hslider("Common_Parameters/12_Note_Scale/Ma/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/Ma/0.01_Cent",0,-100,100,1);
offsetPa = 1.96 + hslider("Common_Parameters/12_Note_Scale/Pa/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/Pa/0.01_Cent",0,-100,100,1);
offsetdha = -7.82 + hslider("Common_Parameters/12_Note_Scale/dha/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/dha/0.01_Cent",0,-100,100,1);
offsetDha = 5.87 + hslider("Common_Parameters/12_Note_Scale/Dha/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/Dha/0.01_Cent",0,-100,100,1);
offsetni = -3.91 + hslider("Common_Parameters/12_Note_Scale/ni/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/ni/0.01_Cent",0,-100,100,1);
offsetNi = 9.78 + hslider("Common_Parameters/12_Note_Scale/Ni/Cent",0,-220,220,1) + 0.01*hslider("Common_Parameters/12_Note_Scale/Ni/0.01_Cent",0,-100,100,1);

noteOffset = offsetSa,offsetre,offsetRe,offsetga,offsetGa,offsetma,offsetMa,offsetPa,offsetdha,offsetDha,offsetni,offsetNi : ba.selectn(12,noteId);

realFreq = bend*freq*(2^(noteOffset/1200))*(2^(fineTune/1200));

String1Tone(f,g) = StringModel(pm.f2l(f*(1+variance)),0.63,10*StringPluck,0.7,0,40) + StringModel(pm.f2l(f*(1-variance)),0.63,10*StringPluck,0.7,0,40) : *(StringEnv)
with {
    variance = hslider("[00]Variance",2,0,4,0.1)/10000;
    StringPluck = en.adsr(0.00001,cperiod*0.7,0.9,cperiod*0.3,g);
    StringEnv = en.adsr(0.0001,cperiod*0.6,0.5,cperiod*0.5,g);
    
    StringModel(length,pluckPosition,excitation,brightness,damping,stiffness) = 0.1*pm.endChain(egChain)
    with{
        openStringPick(length,stiffness,pluckPosition,excitation) = strChain
        with{
            dispersionFilters = par(i,2,si.smooth(stiffness)),_;
            maxStringLength = 6;
            nti = length*pluckPosition; // length of the upper portion of the string
            itb = length*(1-pluckPosition); // length of the lower portion of the string
            strChain = pm.chain(
                pm.stringSegment(maxStringLength,nti) :
                pm.in(excitation) :
                pm.out :
                dispersionFilters :
                pm.stringSegment(maxStringLength,itb)
            );
        };
        lengthTuning = 14*pm.speedOfSound/ma.SR;
        stringL = length-lengthTuning;
        egChain = pm.chain(
            pm.lStringRigidTermination :
            openStringPick(stringL,stiffness/1000,pluckPosition,excitation) :
            pm.rTermination(pm.basicBlock,(-1)*pm.bridgeFilter(brightness,damping))
        );
    };
};

process = String1Tone(realFreq,gate)*gain*gate : fi.lowpass(3,4000) <: _,_;
effect = dm.zita_light;