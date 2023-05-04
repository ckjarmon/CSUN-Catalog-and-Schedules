class_codes=( "AE"  "AM"  "AR" "AAS" "ACCT" "AFRS" "AIS" "ANTH" "ARAB" "ARMN" "ART" "ASTR" "AT" "ATHL" "BANA" "BIOL" "BLAW" "BUS" "CE"  "CADV" "CAS" "CCE" "CD" "CECS" "CHS"  "CHEM" "CHIN" "CIT" "CJS" "CLAS" "CM" "COMP" "COMS" "CTVA" "DEAF" "EED" "ECE" "ECON" "EDUC" "ELPS" "ENGL" "ENT" "EOH" "EPC" "FCS" "FIN" "FLIT" "FREN" "GBUS" "GEOG" "GEOL" "GWS" "HEBR" "HHD" "HIST" "HSCI" "HUM" "HUMN" "INDS" "IS" "ITAL" "JS"  "JAPN" "JOUR" "KIN" "KOR"  "LING" "LRS" "ME"  "MATH" "MCOM" "MGT" "MKT" "MSE" "MUS" "NURS" "PERS" "PHIL" "PHSC" "PHYS" "POLS" "PSY" "PT" "QS" "RS"  "RE" "RTM" "RUSS" "SED"  "SCI" "SCM" "SOC" "SOM" "SPAN" "SPED" "SUST" "SWRK" "TH" "UNIV" "URBS")

done=()
for i in ${!class_codes[@]}; do
   echo $((i+${#done[@]}))
   python gather_csun_schedules.py Spring 2023 $((i+${#done[@]})) ${class_codes[$i]}
   mv --force ${class_codes[$i]}_schedule.json ../json_schedule/
done

# python gather_csun_schedules.py Spring 2023 17 "CE"
