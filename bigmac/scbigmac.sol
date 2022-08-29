// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract scbigmac is VRFConsumerBaseV2 {
  VRFCoordinatorV2Interface COORDINATOR;

  uint64 public s_subscriptionId;

  // Rinkeby coordinator. For other networks,
  // see https://docs.chain.link/docs/vrf-contracts/#configurations
  address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
  bytes32 keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
  uint32 callbackGasLimit = 2000000;
  uint16 requestConfirmations = 3;

  uint32 public total =  7;
  uint32 public numWords;
  uint256[] public s_randomWords;
  uint256 public s_requestId;
  address public s_owner;

  bytes32[] public participants;
  uint256[] public indexes;
  bytes32[] public winners;
  mapping (uint256 => bool) private selected;   
  mapping (uint256 => bool) public removed; 

  constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    s_owner = msg.sender;
    s_subscriptionId = subscriptionId;
    participants.push(0x641b11da408590705534ed5490f73a3b2a67b5a863e46bc5d91322f67eea15ef);
    participants.push(0xa19feb02fec238cf38a8b3c705f86a9e5459257a9a41e25dd8ebbcb0c6aaab6e);
    participants.push(0xc6e41e80b39c3c58626f32d6f57aa26ed2dfa90639c6fdd81b4304b38627a0b5);
    participants.push(0x756640c74d245e4d0003bd2fe35e03114ca1d01f4d2bc3fae69e5ff46bbaa848);
    participants.push(0xcead56737fd58f6ef896ccacb5523b90accb921738df2d1ebe69b08615be63f6);
    participants.push(0x2e843a5100663bd2484904fc6d0a27dc593d09c95013eeec75ba723a53c3880b);
    participants.push(0x9ed9831bccc8a109a23e67ca778fdca3985a95d19ef39904f93be5b98abba8f2);
    participants.push(0xff6be7db6902b7956c6da8ec6ba021d53102f2c512ca8145a3bd4b8aab8596c2);
    participants.push(0xd85daa67a18e148827a490bd89d40614ca739d41edd7507597f25220cbb958f2);
    participants.push(0x30964ed4d2f4964b8882c440de7addec87b777d8b73a7a3f9cebf6dacc358b7f);
    participants.push(0xb197798873afd284bdfe64b4ebe7c3445bed4a12f7a806bedf4a17893b1bcc8f);
    participants.push(0x8a01c93eacfdd1d91599f5f73a9812cf53f2f4292d41355362d7c101a0856594);
    participants.push(0x6899b6e3c8747bf6cbb953cd0c82f8778de170dc609b05a04d888d27455ccfe5);
    participants.push(0xa8ba68cc4d096754a816e1ca4408df6d77c18c58e3bfa2fde3af5f463630bb9e);
    participants.push(0x7f6ad5c4cbe8307bcaead6ab05661ffd95ccee397e9aaa0f720bf1d94a52cdda);
    participants.push(0x2a5063c2f863d2d63a390a6e794d7255dfb1310209a62eb3283f3cbc8983ec37);
    participants.push(0x762c42da99e84841e023ce8fb770060c3ddda5455eabc8ea5b0d4dcd827f62af);
    participants.push(0xe62fc8cf112b6335ebc7fcb25b551c12b0ae1a7ee57d046f29c885ae9894e48b);
    participants.push(0x0f007ae7531709f489a90c3900a881a99fbad6ff1e7f91bc84aa165fefd1b40c);
    participants.push(0x929053d010f74133d9dc34e4be193e7d60b512382be5b04569a5e8ca12e7dc52);
    participants.push(0x42f5ef20940cafab8387e78ecb4a8e69d138c95403ad15aaa302436c9e55ad55);
    participants.push(0x5869dce3c57a06fcfd10c61f6d290cf7e6aba8c451ac6e3ff7a3bfaffa00f98b);
    participants.push(0xe1f4e18eb301c14e7d06659098554757f790fbacbaf7e68dc4bfe6c4450afb86);
    participants.push(0x0fc1422616b0ef5bea7471de18f8367743013a8414aece259b2ce5b344bb343b);
    participants.push(0x7cc658260452f0e0a24ad15406ae5f8e245e366d7d1618c449e3e6086414cf18);
    participants.push(0x264d3dcbcb11ad7508f37a8d7bc26403ed947e57f1f88ada95d0a0efb0579943);
    participants.push(0xbd69c9ae3ba74511a4068163b5b4b2c6772862119a80d09961269b47f8b3f930);
    participants.push(0x5de599c142bc880072143520b31eb8ce3937ee07407abf748fb785ef5fb411bb);
    participants.push(0xc4ca233746475eec5680a752f85e62be39580f93b42c746e5a5a09b97b9167a0);
    participants.push(0x4f1373ba5102ca9980c1c7aa7f9c6ec6150ce039fd76466e898b236711750fec);
    participants.push(0x508b8e5e978dc957f3279fc689c0591a9896cecb27f6fd376430af23495f27cb);
    participants.push(0x3f71c787d1a8c73c1a5edfa72d74371f431838e43caaa86462b1ba7d5c6b3004);
    participants.push(0x348d46b20abba97f1c1d3379171ca92ec1e3ec65458ef01f8c6cbfb201ff7e35);
    participants.push(0xfa4c67caa0c95ca1bf3f734b677909e328d39d08a29ab47be364cc79e1d2b627);
    participants.push(0x818e16b1918ebe84fc8bbfebaae5e741d4f893fa699567a672425e2a008c8ecd);
    participants.push(0x4de996ca2823268aa9a455032ac62abeafa5a6185383eb1d9ff9774e5d6ac079);
    participants.push(0x1e512f1734b34a15b6783bbe4e28ff95360a888f4c4cf873a19287af04b783e8);
    participants.push(0xaf4416a7b3501ecde930fdb685bf66c9f4bb77c2a580d1132a2160b3e36d1ad5);
    participants.push(0x5e84b7a5353d4957f1cb948b4823537ad930b10bc532a9c30770a45bc715c111);
    participants.push(0xc30fd25e891589ddc9465bbe408ebc7eec9436d60e51563f732b01f1b0a92078);
    participants.push(0x37b5dd4bafcbb4ed9d853e14338249555aad8b10ca4a81089d17cc187a2d2acd);
    participants.push(0xb05df877207f692663d2bbb7584d531167fd36a97ff5d6f8f5e0c3ba386f8b73);
    participants.push(0x6850386a74016325460156ac4b64aa525761d1a346b848ce4023c0cd77a457bd);
    participants.push(0xa258176d94f22c437613f49048e0a1698a828ac0f9e6f4a99789897303f5489d);
    participants.push(0x9af0280b32aa19474f4ade1f026d50664cebe2e383d3c48ae427c99bebbd12ad);
    participants.push(0x5cde34f633a21b86c8ae5313a9263d704038fbe667f823e84b1f0fbbcf6bcb4a);
    participants.push(0xddbf39571cdbc981733cd0b7f1a52fa2604048210fcf8bdca7584aded940e4f8);
    participants.push(0xaf136061e31321f0b0cf825508f8808c8ab12701e8bcc967e925f14b9dce1f89);
    participants.push(0x8762279fd938c688142b55c6a21a8d8c60945648e6d344de1457ab17b868a049);
    participants.push(0x7e1005b08acf46f07f4ba46602c7dc3333c4be1dc3b07a7b61108c0fcf1faa3a);
    participants.push(0xf689fc5d26826a6de0bedc5268aabc98b5307caabcf571cef61bbe1a7cbeea81);
    participants.push(0xef007bdf6427564f997c2f71068bf503d1d6172bbf48286e4762a7b30d60c8d5);
    participants.push(0x5d99a801ba3b5831b857154302017195a1940f85dc670b3eeaf5ae5f6784e06e);
    participants.push(0x1c5f2bdd0e19700e308904603b69cd300e40cfd8d18c7e5b04862dbf7b52023e);
    participants.push(0x26f3e0e6193f02c3137d2d23338c19a2f16011baea907a6debf46e2b479340dd);
    participants.push(0xbe3b5c5224f5d79f6975b6c085d6a69aa1f53cb261ce64e13ce50ad1daca9667);
    participants.push(0x10094660fb63d7b307617b177e21f82b05c28e0d6a48dba7450eba9bc98f09a2);
    participants.push(0x14064b289f4c3d6004d62e698b28083e5151b3ddc59e5b9e1f593b7e3a1806a0);
    participants.push(0x9826a073710461a46a72f6623245072f0121f0206419dda4357cabc7f69915bc);
    participants.push(0x51ce3e5fc1533a121d42d379948005f232c8d2a263c175dbac3402e96faa72e5);
    participants.push(0x246cd2491f5ab0f5aa56caba814981acd79724ed8e31fabfa574dcfd94e04fb9);
    participants.push(0xf12574f6c270840dfa5ccb7345f44dc05750c960f629e4c908ec9994ed8b8fba);
    participants.push(0x6643ed22722d3446797a0f38773c8e64640ce8a67189696b7a428f7619335dd7);
    participants.push(0x4056b59a44ff450e42a9b4acc0e37870b64b7333c43d36df3fa4491921815f91);
    participants.push(0xf34c1e8f1674f586cb6aa6dd654c1459ab25b81d3f2db26162b839f2517b7db5);
    participants.push(0xc1fc8c454069aedeedcc546564c04d8117b3f95573322a094fa5ccc57088d7bc);
    participants.push(0x5417a85a546d69f142deec8e191644f05212024253d4b4d400b122badca8d888);
    participants.push(0x153cb56403174e3e8681b5e2f9db5c15a8a9c38ade78efbfb40b5d95d929170d);
    participants.push(0xdcb99ce89dec868a610debb50f1cd68555ac75197c43891be58857835f05e014);
    participants.push(0x1049d5e520aa67069acd08bd4c62aa459afc08d215bb40cc19e78d474acfeae3);
    participants.push(0x8988f55288729a137e5003981a56db0c5eb2a400be05c87501ea16107642b175);
    participants.push(0x8f6fe09611cfd593a235f6c890144b8095f523805751f52d72df5725590da6fb);
    participants.push(0xf818da10c53ddca3358671567b03cc9622bec9f975bccb6e65be1476d5a3a3ad);
    participants.push(0xb8bde07b182974192530e48d284c13c4dfaac44010f0761bdd23113ccb82716a);
    participants.push(0x6300c790fbd9de6fc078505763298e5a0f2fba14c005497fa09bd2ae6b075cc1);
    participants.push(0x821406afe228718d2ea5ddb18407633df33d61cab659ad52fb1831ae0bd7ed20);
    participants.push(0x52a7b73efebb6783de8ef96bfe0221f694bc63ff7d2c7808ba4ab93de0fdf03d);
    participants.push(0x62530d565bf64ab0db0e956394fcf65dcf972a379f4999f4a416701417ecbc4e);
    participants.push(0x95e26c82417016dc30c61e3d3babf4bac03503cb7555e6f4688cebaf81cdb5fe);
    participants.push(0x3407e07c3567a36055b90beef282db7781651b561a537023d4db9a4175dbe5e5);
    participants.push(0x1c2188c67f12fbc9380c15dfe8c385ce1914f8bb41fad2ed58a878298f631de2);
    participants.push(0xc00208a5b055ba062454be9c8234d9d0ce9a9fa3eb25b500543f62852d9d70a0);
    participants.push(0xe732500575702532c131faceef978523280a74cddf4f562beda21acb11101809);
    participants.push(0x9a5a9f9d334e0683c2b0db4f187c0e305e2cfcfefc7ed98dff32af045139be1f);
    participants.push(0x4bfccaa52f3b45ce72b2240c2545167c8a9cb98c8d88144445d823a2fb6a8b33);
    participants.push(0x5ce51ea3813f728abf39f1bf4376e7ecb8d5feacfe73a267274980886ddbffba);
    participants.push(0x5e054bf362f50357082ad8cb91c0fcb126d281047defda0db23b4f544a3d8eea);
    participants.push(0xdbc3c2b2612e13b5b00d27b237155fb8923be9b43a3ba286abbbd6c81dc83252);
    participants.push(0x80328085c8eca24b9700c941e677cc95c81345bfb45e88e5db5600c3e414dd2c);
    participants.push(0x7b050e0dbf480487cf522a0bab2e6dc73dd9ab4a2793871f254ea08aecf14eae);
    participants.push(0xb9cf17524c196635f410e7428f162a5c930071a9d931db39ca923029913a27d4);
    participants.push(0x0fbc695d5a7452d7b981870a10ad2f21c204dab3d0108ab5f5c894207b2f2dee);
    participants.push(0x8326368945d8bb6f6839d1421b5426f6c029e2a0e8ec1fcf9d8c8993f3fe3cb4);
    participants.push(0x3930fd0fcba7213d093509815e0157e2ed63a6233ea74ec509183bd06fc3660f);
    participants.push(0x54480d87a3b7a04ea754d3c1bf006d38cb8dbee83d596c55afed6fd424b1195b);
    participants.push(0xaf8dc73766dea29a97468d46f34a59591e9af8baa335d09671c68a98c63bb504);
    participants.push(0x71c9da993d836059f55468691101ede93dc7b22480d2be2db7ee6ca8d6352dbc);
    participants.push(0xa14e7f9f8944f4cb10c07903998e38b58637db898ff732b3e3f40e002d3c03bf);
    participants.push(0x5cb3f28f47f4ed8ed479c3f38f20fa25c3b9badcdc7b9d769095cdcecfbdc02e);
    participants.push(0xa0f72f05f14cc08abeaf1f326714c423504a37e1d9dabc6d20b2d11ec0a8ab33);
    participants.push(0xb0c3d5c672d2718c90150034ee01d8e94b1c29dc4865521f96070d9f783e0efe);
    participants.push(0x3d9965b015864508868183a7c55512a5888fbea133502bb22bc29f9cdef4fd75);
    participants.push(0x68b34b79cc7cedebe06af59e4b0fad174ab249a0f280183a6184886e30c4eff2);
    participants.push(0x0992055a67319c847324b16734b793f43730a0b5ba489b013ef62c2eb4ba0cb9);
    participants.push(0xef551168b60c4021724da63e2b640b0b8375425a283292c5e09c0ae20122839a);
    participants.push(0x64a806ced4c421a8742c35c071a3b5a2bad4164b9b635b35530be814fa407b8e);
    participants.push(0x931e0dbca7f0a975e3a0e8c560bfa0dc789dd1d17128fecf462792284d35bc45);
    participants.push(0xc714f79decd51a1bea8e28cf398fb4c453748710fd142c19fa9aca6e1f4717b3);
    participants.push(0xe29be228296cf409240e8f55406ef77d5f234fbe0cb3f81e98c0bde962a79a49);
    participants.push(0x8021fae1f286c93b1a02580deb7f758600e0f4030278f306aaed43aa82d0a337);
    participants.push(0x9da736bf5210bb1e6fd9571c082fa49c17cf021003e59fea03d9d1db5210635c);
    participants.push(0x47f1e723af2caea5a0ac96e967fd1bf7f4994146e87ca4041856f3a15faa5d22);
    participants.push(0xc05c42efe7d4522815ca8fac708ed30034cdfd2382e03df6ad01ffb97ede59df);
    participants.push(0x6cf430d67bed48b6debca3ef47e9238d7b18fb39c1752b946c5e8f4eced7ebb5);
    participants.push(0xac2edc754d25d9944d47a6c654080430555989211b4087330a8603d4b17027cc);
    participants.push(0x4a075c9bb984f46c6d44a302487d68853029180f7f70376553c4c0f0d4a023c3);
    participants.push(0x635379b15998c4e0adfb9ee55612bea24423c267cd0c0808987b2a9c00eaef6c);
    participants.push(0xf8d3db573063f47e58e46a7468599d4f86c29aea897f84b30276e33b75ab9fbf);
    participants.push(0xf53dcd2cfa881a33e93bf34cb2790f4157573d1a6fbc49dc69240ee857bf7e4d);
    participants.push(0x9b775cfc5cfd4830f9d647aeed7477898b63e28c2d7c2a61d5f120a987ecf2da);
    participants.push(0x3a393971ea55d373d999eb6ed2314c525c784eae200e2e192a1e9ca0a0f11809);
    participants.push(0xd263a056050da9de6f697ef9f258fd83d05fb846c384c5555dfdf38f26be3dde);
    participants.push(0x9166ef5ce65967db7f6dc78b4505b97306df6a2ba6a83f93e79300421a759d08);
    participants.push(0x3607dd718ad455d824765d0b0c946fb0dd22d24d3e043a4faf4f1cd22856e502);
    participants.push(0xb10e3cbbd3c9e40e38edbeeccef10ccff47f69d04c12f614ef09ab357382ab46);
    participants.push(0x7bc0eacd977b5987904e1374371f8f7e8ce9be0f7adae5bfd2a7d8fd7707239f);
    participants.push(0x468c2193fe46652461b3109c64c4a0b654113a50f9bc5553044f9928643189ad);
    participants.push(0xc07ea6c5321f47c39f9011d13386bc3aab1cdeb4eb7a359eca65a7dc34d853b9);
    participants.push(0xe3577379148a79f97d07ed952f952f239e65511b76300d76cfae3196787d35c1);
    participants.push(0x5c52f0d8dc1aadb49e73730ecc0fc91eb996b1f614c7e445016b48915c8526ee);
    participants.push(0xdbb1bd40dcca11a630b6e64a55e1a64da15e23c151b082907393a5a897636848);
    participants.push(0x80c7f28abbf3a045e90f3a830d206da8f3c62aa1620bf6e26970548efdea82cb);
    participants.push(0x6c19755ec4f3d3fe22f8a5df245c2e8d5a92ecd6e33acbfb0732e0e41bcc4308);
    participants.push(0xc54fc9512b9f619dcb52e8f43991802a5af1ede040c733c709b89970e48011d1);
    participants.push(0xe8136d45d3d795fa36bbb185516a7f6594c7d35eb1c8c5d88a4081d59583ce93);
    participants.push(0x3091918aedd3736eb2a8bf13c8ed1e0591121f0e9bded896ec6a768b0c3e5843);
    participants.push(0xfd276c6d90a7b583fb8add0d70da4ab23000301b5fa30c9de9720c6812a3c34c);
    participants.push(0xfb2f0aa4e3f95b2d9d480361be10df51fad68854348f27a698b2623d64badbe9);
    participants.push(0x550cd7e61c64643351373b0b22cf3e78503f7ded5dd56fa052735a900ca8384e);
    participants.push(0xab0e2df5162e43f4aa077e98aab9e0f93283ebd0c8a372c061f39d63632ca2a9);
    participants.push(0x57108939f7d984bbb5cf6612b555d2d21ac99840649a4ebe63fec5cc158db04d);
    participants.push(0xfe0ddbffde233e548f1cfb83f39a01afd4c8a2bbfd069371e8053c0ac7506745);
    participants.push(0x70f135894bf684fbebe2b37162b73f8901e7ad021bd3fb7b92ca876c0fa9ce5f);
    participants.push(0xc2296d861dba29a8cbc07c736692f2cd6c4a24ee7a9b4528a338271769c86c79);
    participants.push(0x79ae52babd7be42f6c702711b5ac29bb3dec0d338875a75c7a411a17721d5828);
    participants.push(0x04f857e1154fa59afa4a73b804aa908338d4c6b1d513162cac85aea2561821e5);
    participants.push(0x5ec206500111c8c41f56d1490b1b4558558a96a030dbf38ccb5beeed647a3964);
    participants.push(0xd34044d78d968b4dbbacd79a1768ac5fdc8ffd6aefd315daa350c6d20d5cdb29);
    participants.push(0x4415b4b28029acddf0c3e6393c4c264a86f07c39d5ef117fc15ffdd184b3c5a5);
    participants.push(0x7d4c6b8ead1f3bc33195125240b158511dff0612077433350f561f800f7dff5d);
    participants.push(0xfc448a46b12ca6bf9c540ee493ea5b78d409fc25528f13b4765e48665db7b78c);
    participants.push(0xb263afba6626665ef22ad6c09e4f0b3614f4eb4f7e84b3155e758b6266811c91);
    participants.push(0xd2b328089b0d548fdb14bb0ff24da6f566a4fcd468c4ecce43c14766fc866bba);
    participants.push(0x1b0622b0ff3387c5ba0215fd7bf36a50f3c1e60a5ec9388da699414ae5c97873);
    participants.push(0xfea6daceea7f576af1fbec86d02da0f918e0d84ba6e93ada4be52179b8cf90c3);
    participants.push(0xd7180c9f1b22d8f3d06124d64220b2cc0be1b7368c3486a9c80ba6062204d2ea);
    participants.push(0xadb4f8db643e10586617696fc037ef016435d0cb4593f3e7e062a89c8eeafac7);
    participants.push(0xc0fdbb8af3243b57d4f0a7d292b61d310d590eff88ebdf39ea2215732414bb89);
    participants.push(0x104f211332ea14679eba4f9028e6aead35cc1fde550fc342ab1dda32d46d0a8e);
    participants.push(0x70666371c8d81c68efd591abad1e8949cdeb72375e72b77a6c9078e2ba4be3ca);
    participants.push(0xa1b97a8ae2b97ed885ec7ad55798aab0bb77c93458ad26e3100525620fe586ca);
    participants.push(0x63987333dd65d2e3514c8e1c34bb3018877e611afa935da69685ec8279afefa7);
    participants.push(0xafaa4cbe5bccd202c2f96b90e8b765635a34480c0ee014e3e2111fbe11b2e974);
    participants.push(0x2c5d607ed4db35d982028af31be35c530fad05246b03fb62a4ddfb6436b9835c);
    participants.push(0xef4016a56baca82043e030f66fb96e8a3cfb94a371dab5c17c58209abf2333fd);
    participants.push(0x433df8cbb680885f5cb234f6d549396123a5d50b048e9b86f7c01cd14d120a18);
    participants.push(0xb1c1771fce7fd730607ddaa405683aa8f0ed64101b98f1ef022193ca4d14eddb);
    participants.push(0xc1eea1ade90dc5c73cdc05ab99c5fa63192417059d0220fce54b3608bb6a7e6c);
    participants.push(0xb5fb9a542d0b7b5e66d8c698c284e492414ec79757430741bc4f3fa10c70f7cf);
    participants.push(0x5397abe91dab12b2c4638237a8f7e48f40d215083eaa6c6d411a198cf6d094f6);
    participants.push(0xa1d382488f9cd19e25d82461136bed9b14f8699af0ea60d2368cf00d2027d0c7);
    participants.push(0x3bf0d5cfff8e8205755e5a39b63850fbf7d4a6cbaf253d0ce296f804365d5ea4);
    participants.push(0x4d08139d555a7f4a254f5384a890ce767ea50d00cd757dcce5a58729cf9c6dcf);
    participants.push(0x5fc388dd66e4a8ec6143a0bf1900c02087ed5cefde62ca20ebe07728877e83df);
    participants.push(0x2ebd2024176b5419b5dd06264a5080b7e778e8a66c2419de33e8ae056a5915a7);
    participants.push(0xba6f392228c273ac20719b544750a8860538b3d030f1afd0c1f5d43a5c9b420d);
    participants.push(0x4f87590204eae209feb2d15ddcbabe71d29e855b621cf26f91600dba30e1983f);
    participants.push(0x755f756684b269ebd9f0a31507f840a59ea1b0228530b7630974d233090f4d44);
    participants.push(0x8a1d3f5c116db6e22ce61a045cfa51b76f8ec6686515a4bc5e327b39fdae3733);
    participants.push(0xa810c68a8a01445963af6f3e07ba2e8d7fe073b4344b1a4051c58e0bc61bc623);
    participants.push(0xa213054a7d300372cafd7d3739e276ccde6348a9e388d755aecc86fa687ef858);
    participants.push(0xf39815f890f1545cb81036456b16949f4a082749ce51868fdfe2ea0db296d630);
    participants.push(0x2a774a6a18bf852efb274420d22726e1d6434347447348c403ac5f0c89edb1ec);
    participants.push(0xf3be8e1ed3eba0b0d72d8ddcab36afd7863dd8d2427dbde37efec1616192e2c4);
    participants.push(0x954a34624d8e216a78147c2a39638e8d3343de123e92825bf8ca29583bd4ff27);
    participants.push(0x927041f1c44e4769eaf4ee6577ff83866fcded7d701f3bf30a84f386e4c31b92);
    participants.push(0x86ff91de2898185b8b084180ca06cdf1e84445d49771edfaeacb89ef7dd91d37);
    participants.push(0x6c3e08f9aa08a89a51c94c78c46f7ed132b4c0762b9d8ea93a85f736ab709524);
    participants.push(0xd7f97644305b9c8a2d96b743b73cbc62565aa9b5c0b66bbfc2d02d7cfc717169);
    participants.push(0x35655d7ea4e2e43c4a716f9947579cb0d2926660d92e821a707284d42c9cfa02);
    participants.push(0x8fcc43a5aad6a330d3817c8c7f7d56d9c1d304c39a2c3efa917f3fdfeafd13db);
    participants.push(0x839f9736937fa39b656475e0a60f48c821ecfcc6edda659e6b0ba6e8bc2106b4);
    participants.push(0xbc8abde000279f744a7d46da0d636f8c51b328dc02ffbeb2f97b5cc632592db1);
    participants.push(0x4dd5caebfe71ad0d24777b7ca74f6d575ed68834521387b2d64cd1c5a3f8f07a);
    participants.push(0x6190a0f51058f4b3db43257086facf120030e7c495544e2e22bab7f28f0a89bd);
    participants.push(0x462addfec82d4f2cb6a87cca636a7f93293289ec8977987ea079f2691868b0d7);
    participants.push(0xfe29e8e1b7e3ff29132ec3e947fd34d5433a3ee122c59dc9925b8814d15faac8);
    participants.push(0x4411ea8e1e59d552da7a3af8d0b1c3828186936e885a68e393923b4ed8654417);
    participants.push(0x1593d94bc9326cd1bf0be652c5500ef1196c974b2deac213c46ad882b060fce0);
    participants.push(0xe226493c35ef15b956fa5a05ea77e1b626947dae67ac36da954213c4b533f33d);
    participants.push(0x5713a12452f2555523663e349a69d25e591f86802aa0c18425bcd7af5baf0dd8);
    participants.push(0x4df6ef3986c890740ca2d1bbd67e063101b9b1a6c521728382881700444ccc53);
    participants.push(0x7377bfe914a0979a5f6dd9c5242e03892cc26e11262820bba541a28a8f9b908e);
    participants.push(0xd177789eedc7c94c66810400b632a79158d8a3ad8760e1149e806ea8e2b1f987);
    participants.push(0x69a0f05bf4f7b826738f82c11366397e60de78abaf111941538c5f45021e095b);
    participants.push(0xc120b4d20493030bfca3b5d1f85287dc2715e87e40ad0ecfaa87241cf4412a74);
    participants.push(0xb801015261a1dcba4021c68c72a3563869cee42862f9757b8e4dd15683808bbc);
    participants.push(0x16673edebecfb7f3860afd99af430d27228fceebf0c58acfa800a96acd509500);
    participants.push(0x3eaa5af44fc6dd74253f1e595a559e1fc90fab77f5a96ebf721d76d1b95be2f4);
    participants.push(0xe9e47c1f3b9205373c352ef927e5924c82c285f32d994b59caf702de9ed6730c);
    participants.push(0xb0d304d343a1c0dd043552b24fc6bd614e9a3f9c061886910724768b2596ea00);
    participants.push(0xf6956c3c7c2e4a77d5eca28f0d879c59c96acd9e98ead950321bda25701fc234);
    participants.push(0x03a3631e2274cd125c80b84c67c824988e09707f7622badb1399cb4f52837c14);
    participants.push(0x8ff853b8e4d0fdcfa574603958e5571c35dbdde517a8a322fb7797b25547a00e);
    participants.push(0x1c87e37289472fd0e399ce2c5320244c726f9636d566435ace6525dd62e01150);
    participants.push(0x72f130fa9a6397c80999b9057cb579754472142dc411cb6fc48cc5e9ec1ad056);
    participants.push(0x54e4a4c22e190b63f1fbdb231aacf417fb40a288096981a420451f39fa7b384a);
    participants.push(0x2aaa45affb34e5ccdfece5ca9dff4dd3014a5651f9b44123489b12dcad83d2ac);
    participants.push(0x29687b53a1814b9496b7a141660054c835c0324e4f0851e849e5aa6c640357ee);
    participants.push(0xab6c0333b6544caece6087ee699940b1cb3c6b1b696690dbdfc45c92e23fc414);
    participants.push(0x3c023a5081ae97fb4fa214d233e4831c61168b41be5bb6c1131e42fbb29622ec);
    participants.push(0x58bc086d6c0abed01c03e3d7d5489289035ad9afa7d496f4d3fdc5d0216e2279);
    participants.push(0x4121e62e50c9b6345f60f9647274947689c2f1450d413010531061d303082724);
    participants.push(0x680e9ac1b62d2ad60a81cbc5432a924345ff0a1512286411bbc6a7734578169a);
    participants.push(0xd4eb5e1f6ce5f4dd4e7e6a750818c26d2fa6e637a7dae81b8f1345fe2c755857);
    participants.push(0xe5e913b7afd7adf2916f16f5afe20356f103aa95bbd1ac677e6e4abb4db4b480);
    participants.push(0x34864997261a28df47cc2964ec407c1041d7e7df72cf47f38cf6a839df5d3272);
    participants.push(0xe41d53b4a77d09c7364b27c6871d38caaea726754b7f1097e800a44ba6123a41);
    participants.push(0xb6baa9831efe69c8eb50549c10185b77b03da4f54ab17e0f8127e80543ab27cc);
    participants.push(0x994aab0af51ac8974815b9961f7dd52d5bc9a0ea9dcdcef89b21d782ced859bb);
    participants.push(0x4d6d86936695818f0f9f825e44481f107817b1f572f63e89b64570bef9a7c116);
    participants.push(0x03fb6cff3cc9f1e962fac373b0be6a94d60e9a27761fcdf226ed87eb2fcd2637);
    participants.push(0xae7f00a4818ab5a5119934280c0a428467ee0ad444945515b3a5c47c50136bce);
    participants.push(0x0805a75f3919f40267219c2ca7ab024ab20530190f7c6af210ad65df0b14ba2d);
    participants.push(0xc6fb9f904f301c37042f5af743b18b2cb9d282813d711bb9d6bfaab12051b028);
    participants.push(0x9f9a4a95e8e5b49694aab665951089a675bbc73e37a50893c020981a31d91a73);
    participants.push(0xe3e4d4c03d380ad2d082bde761f2196d1e2ff856868c8fc3ab634a16e3a47d88);
    participants.push(0x37c851bbba2eaa91f3f0fe4364941644c5031384844e4979ec5835a6795148f9);
    participants.push(0x67c7d787a6d4313e3afbc0a77a5fdacbf9d8b7d79ddb78c589d2755a0262d6ef);
    participants.push(0x54ed3ebd9708f57ebaf0ffdcffe56aed6efa4d52d74aec9a3d220e54d8191873);
    participants.push(0xbe5c41ab1a88205321bdb27988f7c8b92386eb27e11e0dc9dc60d645e8900402);
    participants.push(0x183368ed97e69fba36f2efb017999f3b86872000ce920b30418044d7dfbf3a38);
    participants.push(0x2762f8f6eaf7b650c899f2570be36adf1008527d579f0e852684579462f4630d);
    participants.push(0xb0640dfde8cdf9349e6b3f87e920dccd882df24329446d1e1ac74c8142768513);
    participants.push(0xd1e45d09f58ba3e08852f8fb14f49e727a16a3475c082a8035dcd4346d904a2e);
    participants.push(0xb69d1869ad1a4ed0d98b681a3c112b1f90a23a0cc9c834f0b16d9271c0b69257);
    participants.push(0xde71c7aa758df72f8920ab2a7f4dccd00cc11050d189b2a90bb5276a18a4e797);
    participants.push(0x2c5eaba369031878fe3a1a72c16f45e15b7e1dd940c1b3bb1735d3065a93c4ff);
    participants.push(0x0703757bf69f3e81ca7adceb085fc990de377f0a3dcb41f9c847311c54ff510a);
    participants.push(0x14afde140ae72111b15ac739a1e53e09b92e435f50c26fa6f14b8089d2ee119b);
    participants.push(0x7f5b0c37437eff1959596b189352ea674bb1bb85a443ae7e98706238d8ee1d64);
    participants.push(0xb37cb22035fe7677c96e633d9c906830051a4fb3f0364d28429335c54cf9ac75);
    participants.push(0xd2b036e193594871311e82402834bedb0c0bce117ebd95796b76ea1dbbbc977d);
    participants.push(0xf0e810890a3399572de9508142f97ccb24018ddbbf1e674e03abeaf975ca0ecb);
    participants.push(0xdb3e60e68381c6491cb7ecd9ffdff28a8ae857fa42f5b639382a3ef3c2dc13f0);
    participants.push(0x48418b4b13b4c8ca8f6fd63bb88f6f1ef65d178c2c450388f7da5c75ed488e4c);
    participants.push(0x2c47834f628f890fef7a3ec34e36ff1904d8de18a044c57b3c9fc4d7c937dd8a);
    participants.push(0x8d8f1017e338864e4ea3282aef278fc674c8bba51e3a2cc23a4c8885614f1905);
    participants.push(0xdd917fd6826f6f966d6d808eecaff65f2df041648de78fe19972db2ffc503dd4);
    participants.push(0x833257b56cf6a58acc9a90b9120ede71df36974d838e3dbadc7ee24d2b148fa6);
    participants.push(0xf6d94f0274c646ec0300655dc8e9dc48343a1d2319c64c5fbc3de5b0ebaa1342);
  }

  function run() external onlyOwner {
    numWords = uint32(total - winners.length);
    s_requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    );
  }
  
  function fulfillRandomWords(
    uint256, /* requestId */
    uint256[] memory randomWords
  ) internal override {
    s_randomWords = randomWords;
    uint256 maximum = participants.length;
    uint aux;
    for (uint i = 0; i < numWords; i++) {
        aux = s_randomWords[i] % maximum;
        if (!selected[aux] && !removed[aux] && (winners.length < total)) {
          selected[aux] = true;
          indexes.push (aux);
          winners.push (participants[aux]);
        }          
    }
  }

    function remove(uint256 number) external onlyOwner {
        require (selected[number], "not found");
        uint256 index;
        for (uint i = 0; i < winners.length; i++) {
            if (indexes[i] == number) {
                index = i;
                break;
            }        
        }
        selected[number] = false;
        removed[number] = true;
        indexes[index] = indexes[indexes.length - 1];
        winners[index] = winners[winners.length - 1];
        indexes.pop();
        winners.pop();
    }

  function listWinners() public view returns (bytes32[] memory) {
      return winners;
  }

  modifier onlyOwner() {
    require(msg.sender == s_owner);
    _;
  }
}
