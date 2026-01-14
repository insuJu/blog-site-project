import styles from './PrivacyPage.module.css';

const PrivacyPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>개인정보처리방침</h1>

        <section className={styles.section}>
          <p className={styles.intro}>
            Writon(이하 "운영자")은 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등
            관련 법령상의 개인정보보호 규정을 준수하며, 이용자의 개인정보 보호에 최선을 다하고 있습니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>1. 개인정보의 수집 및 이용목적</h2>
          <p>운영자는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
          <ul>
            <li>회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별 및 인증</li>
            <li>회원자격 유지 및 관리, 서비스 부정이용 방지</li>
            <li>각종 고지사항 전달, 본인의사 확인, 불만처리 등 원활한 의사소통 경로의 확보</li>
            <li>신규 서비스 개발 및 마케팅·광고에의 활용</li>
            <li>서비스 이용기록과 접속 빈도 분석, 서비스 이용에 대한 통계</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. 수집하는 개인정보 항목 및 수집방법</h2>

          <h3>2-1. 수집하는 개인정보 항목</h3>
          <div className={styles.subsection}>
            <p><strong>일반 회원가입 시</strong></p>
            <ul>
              <li>필수항목: 이메일, 아이디, 비밀번호, 닉네임</li>
            </ul>
          </div>

          <div className={styles.subsection}>
            <p><strong>소셜 로그인 시</strong></p>
            <ul>
              <li>Google: 고유 ID(sub), 이메일, 이름</li>
              <li>GitHub: 고유 ID, 이메일(선택사항, 미제공 시 자동생성), 사용자명(login)</li>
            </ul>
          </div>

          <div className={styles.subsection}>
            <p><strong>서비스 이용 과정에서 자동으로 수집되는 정보</strong></p>
            <ul>
              <li>IP 주소, 쿠키, 서비스 이용 기록, 방문 기록</li>
              <li>기기 정보(OS, 브라우저 종류 등)</li>
            </ul>
          </div>

          <h3>2-2. 개인정보 수집방법</h3>
          <ul>
            <li>회원가입 및 서비스 이용 과정에서 이용자가 직접 입력</li>
            <li>소셜 로그인(Google, GitHub) 연동 시 제공</li>
            <li>생성정보 수집 도구를 통한 자동 수집</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. 개인정보의 보유 및 이용기간</h2>
          <p>
            운영자는 회원가입일로부터 서비스를 제공하는 기간 동안에 한하여 이용자의 개인정보를 보유 및 이용하게 됩니다.
            회원 탈퇴를 요청하거나 개인정보의 수집 및 이용에 대한 동의를 철회하는 경우, 수집 및 이용목적이 달성되거나
            보유 및 이용기간이 종료한 경우 해당 개인정보를 지체 없이 파기합니다.
          </p>
          <p>단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.</p>

          <div className={styles.subsection}>
            <p><strong>관련 법령에 의한 정보보유</strong></p>
            <ul>
              <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
              <li>웹사이트 방문기록: 3개월 (통신비밀보호법)</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>4. 개인정보의 파기절차 및 방법</h2>
          <p>
            운영자는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
          </p>

          <div className={styles.subsection}>
            <p><strong>파기절차</strong></p>
            <ul>
              <li>회원이 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.</li>
            </ul>
          </div>

          <div className={styles.subsection}>
            <p><strong>파기방법</strong></p>
            <ul>
              <li>전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
              <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>5. 개인정보의 제3자 제공</h2>
          <p>
            운영자는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
            다만, 아래의 경우에는 예외로 합니다.
          </p>
          <ul>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. 개인정보 처리의 위탁</h2>
          <p>
            운영자는 서비스 향상을 위해 아래와 같이 개인정보를 위탁하고 있으며,
            관계 법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
          </p>
          <ul>
            <li>이메일 발송: [이메일 서비스 제공업체명] (회원가입 인증, 알림 발송 등)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. 이용자 및 법정대리인의 권리와 행사방법</h2>
          <ul>
            <li>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있습니다.</li>
            <li>이용자는 언제든지 회원 탈퇴를 통해 개인정보의 수집 및 이용 동의를 철회할 수 있습니다.</li>
            <li>만 14세 미만 아동의 경우, 법정대리인이 아동의 개인정보를 조회하거나 수정할 권리, 수집 및 이용 동의를 철회할 권리를 가집니다.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h2>
          <p>
            운영자는 이용자의 정보를 수시로 저장하고 찾아내는 '쿠키(cookie)' 등을 운용합니다.
            쿠키란 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에 보내는 아주 작은 텍스트 파일로서
            이용자의 컴퓨터 하드디스크에 저장됩니다.
          </p>

          <div className={styles.subsection}>
            <p><strong>쿠키의 사용 목적</strong></p>
            <ul>
              <li>회원과 비회원의 접속 빈도나 방문 시간 등을 분석</li>
              <li>이용자의 취향과 관심분야를 파악 및 자취 추적</li>
              <li>각종 이벤트 참여 정도 및 방문 횟수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공</li>
            </ul>
          </div>

          <div className={styles.subsection}>
            <p><strong>쿠키 설정 거부 방법</strong></p>
            <p>
              이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다.
              웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나,
              쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.
            </p>
            <p className={styles.note}>
              단, 쿠키 설치를 거부할 경우 웹 사용이 불편해지며 로그인이 필요한 일부 서비스 이용에 어려움이 있을 수 있습니다.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>9. 개인정보의 기술적·관리적 보호 대책</h2>
          <p>
            운영자는 이용자의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록
            안전성 확보를 위하여 다음과 같은 기술적·관리적 대책을 강구하고 있습니다.
          </p>

          <div className={styles.subsection}>
            <p><strong>기술적 대책</strong></p>
            <ul>
              <li>비밀번호 암호화: 회원 비밀번호는 암호화되어 저장 및 관리되고 있습니다.</li>
              <li>해킹 등에 대비한 대책: 해킹이나 컴퓨터 바이러스 등에 의해 회원의 개인정보가 유출되거나 훼손되는 것을 막기 위해 최선을 다하고 있습니다.</li>
            </ul>
          </div>

          <div className={styles.subsection}>
            <p><strong>관리적 대책</strong></p>
            <ul>
              <li>개인정보 취급 직원의 최소화 및 교육: 개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화하여 개인정보를 관리하는 대책을 시행하고 있습니다.</li>
              <li>개인정보보호 전담기구의 운영: 사내 개인정보보호 전담기구를 통하여 개인정보처리방침의 이행사항 및 담당자의 준수여부를 확인하여 문제가 발견될 경우 즉시 수정하고 바로잡을 수 있도록 노력하고 있습니다.</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>10. 개인정보보호 책임자</h2>
          <p>
            운영자는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여
            아래와 같이 개인정보보호 책임자를 지정하고 있습니다.
          </p>
          <div className={styles.contact}>
            <p><strong>개인정보보호 책임자</strong></p>
            <ul>
              <li>이메일: dol.coder@gmail.com</li>
            </ul>
          </div>
          <p>
            기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
          </p>
          <ul>
            <li>개인정보침해신고센터 (www.118.or.kr / 118)</li>
            <li>정보보호마크인증위원회 (www.eprivacy.or.kr / 02-580-0533~4)</li>
            <li>대검찰청 사이버범죄수사단 (www.spo.go.kr / 02-3480-3571)</li>
            <li>경찰청 사이버안전국 (www.ctrc.go.kr / 182)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>11. 고지의 의무</h2>
          <p>
            현 개인정보처리방침의 내용 추가, 삭제 및 수정이 있을 시에는
            개정 최소 7일 전부터 홈페이지의 '공지사항'을 통해 고지할 것입니다.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.effective}>시행일자: 2026년 1월 14일</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
