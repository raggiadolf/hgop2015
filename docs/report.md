#Dagur 1
##Vagrant
Vagrant er sýndarvélarstjóri, hann heldur utan um sýndarvélar fyrir okkur og heldur utan um dependencies oþh. Getur einfaldað okkur að vera með margar sýndarvélar í gangi í einu, sem representa mismunandi umhverfi, dev, testing, production o.s.frv.
##Virtualbox
Virtualbox er sýndarvél sem leyfir okkur að vinna í einangruðu umhverfi, sem hjálpar bæði prófunum og þróun á hugbúnaði. Við getum verið með uppsetta sýndarvél sem er með öllum þeim tækjum og tólum sem við þurfum til að vinna verkefni á, og getum sett hana upp á svotil hvaða vél sem er og hoppað beint inn í að vinna.
##Grunt
Grunt keyrir skipanir sem kerfið okkar þarfnast sjálfvirkt. Við búum til Gruntfile, sem segir til um hvað við viljum að grunt geri fyrir okkur.
##npm
npm er pakka stjóri fyrir javascript. npm auðveldar okkur að deila og endurnýta kóða, og það auðveldar okkur að uppfæra kóða sem við erum að deila.
##nodejs
nodejs gerir okkur kleift að skrifa netþjónustur í JavaScript. nodej er mjög létt í keyrslu og getur samt sem áður séð um mikla umferð á sama tíma.
##bower
bower er pakka stjóri sem heldur utan um þá pakka sem kerfið okkar þarfnast.
##Deployment Topology
Við erum með tvær separate virtual vélar sem vagrant managear. Önnur vélin er development vélin okkar þar sem við endum á að pakka productinu okkar í docker og pusha henni svo á docker hub. Hin vélin er testing vél sem sækir docker image-ið af docker hub. Við erum með deployment scriptu sem pushar nýjasta docker buildinu af development vélinni okkar, og sækir það image síðan á test vélinni.
##Load Tests
Ég næ að klára 200 leiki sem keyra alla leið í jafntefli á ca. 7,7-8,7 sekúndum, þal setti ég timeoutið í 9,8 sekúndur, sem ætti að vera álagsprófana þröskuldurinn minn.

NodeJS notar einungis einn þráð, en notar asynchronous fyrirspurnir fyrir allar I/O aðgerðir. Þal keyra prófanirnar samhliða(parallel). NodeJS sendir fyrirspurn, og dispatchar I/O aðgerðinni á kernelinn, sem sér um sér um aðgerðina þaðan. Á meðan er NodeJS frjáls til að gera aðra hluti, eins og t.d. höndla næstu fyrirspurn(eða próf). Svo þega kernelinn hefur lokið sinni vinnu, sendir hann signal á Node sem fírar callbackið.

Upprunalega skrifaði ég fluid API testið þannig að það forceaði fyrirspurnirnar í serial, sem er villa sem gerði ekki vart við sig fyrr en ég fór að keyra fleiri en eitt próf. Lagaði það(eins og margt annað í Node) með því að nota callback functions.
##Traceability and deploy any version
Það að geta rakið útgáfur og deployað hvaða útgáfu sem er gefur okkur möguleikann á því að bakka og deploya eldri útgáfu ef upp koma t.d. villur eða aðrar ástæður sem gera núverandi útgáfu óstöðuna á einhvern hátt. Einnig geta testarar deployað eldri útgáfum til að reyna að reproducea einhverja galla sem við/kúnninn finnur.
Það gæti líka á einhvern máta leyft okkur að útgáfustýra deployments til kúnna, ef nýir fídusar brjóta eitthvað ákveðið ferli hjá tilteknum kúnna, þá höfum við ennþá möguleikann á að halda eldri útgáfu hjá honum, en getum deployað nýrri útgáfum annað.

GIT_COMMIT breytan heldur utan um SHA id-ið á committunum, sem gefur okkur eintækt ID fyrir hvert commit, og þær upplýsingar sem þarf til að geta deployað hvaða útgáfu sem er.