#!/bin/sh
langFile=`find ./lang -type f | grep -v CVS`
langDest=../

rm ${langDest}/lang -rf


find lang -type d ! -name CVS -exec mkdir -p ${langDest}/{} \;

for i in ${langFile}
do 
	isUtf=`file -i $i | grep utf-8`
	if [ "$isUtf" != "" ];
  	then  
	    iconv -f UTF-8 -t GBK $i -o ${langDest}/${i}
	else
	    cp -rf ${i} ${langDest}/$i
  	fi
	sed -i "/=/!d"  ${langDest}/$i
	sed -i "s///g" ${langDest}/$i
	sed -i "s/'/\\\'/g" ${langDest}/$i
	sed -i "s/=/:\'/1"  ${langDest}/$i
	sed -i "s/$/&',/g"  ${langDest}/$i
	sed -i  "\$s/,$//"  ${langDest}/$i
	sed -i '1i\define({' ${langDest}/$i 
	sed -i '$a\});' ${langDest}/$i
	iconv -f GBK -t UTF-8 ${langDest}/$i -o ${langDest}/${i}.js
	rm -f ${langDest}/$i
done
	
