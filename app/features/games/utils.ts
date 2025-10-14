export const makeCafeCOntent = ({
  gameId,
  gameType,
  description,
  startDate,
  startTime,
  minParticipants,
  maxParticipants,
  fee,
  gameTime,
  city,
  district,
  gymName,
}: {
  gameId: number;
  gameType: string;
  description: string | null;
  startDate: string;
  startTime: string;
  minParticipants: number;
  maxParticipants: number;
  fee: number;
  gameTime: string;
  city: string;
  district: string;
  gymName: string;
}) => `
제목 : [${city} ${district}] ${startDate} ${startTime} 게스트 모집

1. HOME 팀명 : 



2. 일시 : ${startDate} ${startTime} / ${gameTime}


3. 장소 : ${gymName} (${city} ${district})



4. 운영방식 : ${gameType}



5. 게스트 모집 인원 : ${Math.min(5, minParticipants)}명 - ${Math.min(5, maxParticipants)}명



6. 게스트 비용 : ${fee.toLocaleString()} 원



7. 연락처 : http://smmerse.com/games/${gameId}
스멀스에서 참가 신청 부탁드립니다.



8. 게스트 신청 시 필수 정보 : 이름/나이/키/포지션



9. 기타 참고 사항 : 해당 내용은 농구 게스트 모집 플랫폼 스멀스를 통해 작성되었습니다.
${description}`;
