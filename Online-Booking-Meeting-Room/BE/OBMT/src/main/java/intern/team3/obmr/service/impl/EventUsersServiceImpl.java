package intern.team3.obmr.service.impl;

import intern.team3.obmr.domain.EventUsers;
import intern.team3.obmr.repository.EventUsersRepository;
import intern.team3.obmr.service.EventUsersService;
import intern.team3.obmr.service.dto.EventUsersDTO;
import intern.team3.obmr.service.mapper.EventUsersMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventUsers}.
 */
@Service
@Transactional
public class EventUsersServiceImpl implements EventUsersService {

    private final Logger log = LoggerFactory.getLogger(EventUsersServiceImpl.class);

    private final EventUsersRepository eventUsersRepository;

    private final EventUsersMapper eventUsersMapper;

    public EventUsersServiceImpl(EventUsersRepository eventUsersRepository, EventUsersMapper eventUsersMapper) {
        this.eventUsersRepository = eventUsersRepository;
        this.eventUsersMapper = eventUsersMapper;
    }

    //lấy danh sách các sự kiện mà một người dùng tham gia
    @Override
    public List<EventUsersDTO> findEventsByUserId(Long userId) {
        List<EventUsers> eventUsers = eventUsersRepository.findByAppusersId(userId);
        return eventUsers.stream()
            .map(eventUsersMapper::toDto)
            .collect(Collectors.toList());
    }

    // Lấy danh sách các sự kiện mà một người dùng tham gia theo username
    @Override
    public List<EventUsersDTO> findEventsByUsername(String username) {
        log.debug("Request to get Events for user with username: {}", username);
        List<EventUsers> eventUsers = eventUsersRepository.findByAppusersUsername(username);
        return eventUsers.stream()
            .map(eventUsersMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public EventUsersDTO save(EventUsersDTO eventUsersDTO) {
        log.debug("Request to save EventUsers : {}", eventUsersDTO);
        EventUsers eventUsers = eventUsersMapper.toEntity(eventUsersDTO);
        eventUsers = eventUsersRepository.save(eventUsers);
        return eventUsersMapper.toDto(eventUsers);
    }

    @Override
    public Optional<EventUsersDTO> partialUpdate(EventUsersDTO eventUsersDTO) {
        log.debug("Request to partially update EventUsers : {}", eventUsersDTO);

        return eventUsersRepository
            .findById(eventUsersDTO.getId())
            .map(existingEventUsers -> {
                eventUsersMapper.partialUpdate(existingEventUsers, eventUsersDTO);

                return existingEventUsers;
            })
            .map(eventUsersRepository::save)
            .map(eventUsersMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventUsersDTO> findAll(Pageable pageable) {
        log.debug("Request to get all EventUsers");
        return eventUsersRepository.findAll(pageable).map(eventUsersMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventUsersDTO> findOne(Long id) {
        log.debug("Request to get EventUsers : {}", id);
        return eventUsersRepository.findById(id).map(eventUsersMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventUsers : {}", id);
        eventUsersRepository.deleteById(id);
    }
}
