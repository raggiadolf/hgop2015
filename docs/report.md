#Dagur 1
##Vagrant
Vagrant er sýndarvélarstjóri, hann heldur utan um sýndarvélar fyrir okkur og heldur utan um dependencies oþh.
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
I got 200 games to finish to a draw in around 7.7 to 8.7 seconds, so I set the timeout number to 9.8 seconds, which should be my load test tolerance.

The load tests run in parallel I guess.. When NodeJS sends a request it dispatches its I/O operations to the kernel, which does it's thing, freeing Node to serve the next request as needed. Then when the kernel has finished, it signals to Node that it has a message which fires the callback function, meanwhile, Node could have handled multiple requests/responses.